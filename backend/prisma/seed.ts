import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const category = await prisma.category.create({
     data: { name: 'အထွေထွေအသုံးအဆောင်' }
  });

  await prisma.product.create({
     data: {
        name: 'ဆပ်ပြာခဲ',
        price: 1500,
        stock: 50,
        categoryId: category.id
     }
  });

  console.log('Database seeded successfully!', { admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
