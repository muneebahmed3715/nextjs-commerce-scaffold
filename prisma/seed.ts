import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic gadgets and devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&q=80',
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel for all ages',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop&q=80',
    },
  });

  const home = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and garden',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=80',
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80',
    },
  });

  // Create suppliers
  const techGearSupplier = await prisma.supplier.create({
    data: {
      name: 'TechGear Solutions',
      email: 'info@techgear.com',
      phone: '+1-555-0123',
      company: 'TechGear Solutions Inc.',
      region: 'North America',
      country: 'United States',
    },
  });

  const fashionHubSupplier = await prisma.supplier.create({
    data: {
      name: 'Fashion Hub',
      email: 'contact@fashionhub.com',
      phone: '+44-20-1234-5678',
      company: 'Fashion Hub Ltd.',
      region: 'Europe',
      country: 'United Kingdom',
    },
  });

  const globalSportsSupplier = await prisma.supplier.create({
    data: {
      name: 'Global Sports',
      email: 'sales@globalsports.com',
      phone: '+61-2-9876-5432',
      company: 'Global Sports Pty Ltd',
      region: 'Australia',
      country: 'Australia',
    },
  });

  const homeEssentialsSupplier = await prisma.supplier.create({
    data: {
      name: 'Home Essentials',
      email: 'info@homeessentials.ae',
      phone: '+971-4-123-4567',
      company: 'Home Essentials FZE',
      region: 'Middle East',
      country: 'UAE',
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced fitness tracking and health monitoring smartwatch with GPS and heart rate sensor.',
        price: 299.99,
        originalPrice: 399.99,
        sku: 'SW-001',
        stock: 50,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: true,
        categoryId: electronics.id,
        supplierId: techGearSupplier.id,
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium noise-cancelling wireless headphones with superior sound quality.',
        price: 199.99,
        originalPrice: 249.99,
        sku: 'WH-002',
        stock: 30,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: true,
        categoryId: electronics.id,
        supplierId: techGearSupplier.id,
      },
      {
        name: 'Digital Camera 4K',
        slug: 'digital-camera-4k',
        description: 'Professional 4K digital camera with advanced image stabilization.',
        price: 899.99,
        originalPrice: 1199.99,
        sku: 'DC-003',
        stock: 15,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: true,
        categoryId: electronics.id,
        supplierId: techGearSupplier.id,
      },
      {
        name: 'Classic T-Shirt',
        slug: 'classic-t-shirt',
        description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
        price: 19.99,
        originalPrice: 29.99,
        sku: 'TS-004',
        stock: 100,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: false,
        categoryId: clothing.id,
        supplierId: fashionHubSupplier.id,
      },
      {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic fit denim jeans with stretch comfort.',
        price: 59.99,
        originalPrice: 79.99,
        sku: 'DJ-005',
        stock: 75,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: false,
        categoryId: clothing.id,
        supplierId: fashionHubSupplier.id,
      },
      {
        name: 'Winter Jacket',
        slug: 'winter-jacket',
        description: 'Warm and stylish winter jacket with water-resistant coating.',
        price: 149.99,
        originalPrice: 199.99,
        sku: 'WJ-006',
        stock: 40,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: true,
        categoryId: clothing.id,
        supplierId: fashionHubSupplier.id,
      },
      {
        name: 'Office Chair',
        slug: 'office-chair',
        description: 'Ergonomic office chair with lumbar support and adjustable height.',
        price: 249.99,
        originalPrice: 349.99,
        sku: 'OC-007',
        stock: 25,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: false,
        categoryId: home.id,
        supplierId: homeEssentialsSupplier.id,
      },
      {
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip exercise yoga mat with carrying strap.',
        price: 29.99,
        originalPrice: 39.99,
        sku: 'YM-008',
        stock: 60,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&q=80'
        ]),
        isFeatured: false,
        categoryId: sports.id,
        supplierId: globalSportsSupplier.id,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });