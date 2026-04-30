import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
export const addSaleItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { saleItems, paymentMethod } = req.body;

  if (saleItems && saleItems.length === 0) {
    res.status(400);
    throw new Error('No sale items');
  } else {
    // Calculate total amount & prepare items
    let totalAmount = 0;
    const itemsData = [];

    for (const item of saleItems) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      itemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      // Deduct stock immediately
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity },
      });
    }

    const sale = await prisma.sale.create({
      data: {
        totalAmount,
        paymentMethod: paymentMethod || 'CASH',
        cashierId: req.user.id,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    res.status(201).json(sale);
  }
});

// @desc    Get sale by ID (Invoice/Receipt)
// @route   GET /api/sales/:id
// @access  Private
export const getSaleById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const sale = await prisma.sale.findUnique({
    where: { id: req.params.id as string },
    include: {
      cashier: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
    },
  });

  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error('Sale not found');
  }
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private/Admin
export const getSales = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const sales = await prisma.sale.findMany({
    include: { cashier: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(sales);
});
