import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Private
export const getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Private
export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id as string },
    include: { category: true },
  });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, price, description, stock, categoryId } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      categoryId,
    },
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, price, description, stock, categoryId } = req.body;

  const productExists = await prisma.product.findUnique({ where: { id: req.params.id as string } });

  if (productExists) {
    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id as string },
      data: {
        name: name || productExists.name,
        price: price ? Number(price) : productExists.price,
        description: description || productExists.description,
        stock: stock !== undefined ? Number(stock) : productExists.stock,
        categoryId: categoryId || productExists.categoryId,
      },
    });

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });

  if (product) {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get Categories
// @route   GET /api/products/categories
// @access  Private
export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// @desc    Create a category
// @route   POST /api/products/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const category = await prisma.category.create({ data: { name } });
  res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/products/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id as string } });

  if (category) {
    const productsCount = await prisma.product.count({ where: { categoryId: req.params.id as string } });
    if (productsCount > 0) {
      res.status(400);
      throw new Error('Cannot delete category with associated products');
    }
    await prisma.category.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
