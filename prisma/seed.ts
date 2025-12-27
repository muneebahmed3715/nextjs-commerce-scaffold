import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic gadgets and devices',
      image: '/images/categories/electronics.jpg',
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel for all ages',
      image: '/images/categories/clothing.jpg',
    },
  });

  const home = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and garden',
      image: '/images/categories/home.jpg',
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      image: '/images/categories/sports.jpg',
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
          '/images/products/smartwatch-1.jpg',
          '/images/products/smartwatch-2.jpg',
          '/images/products/smartwatch-3.jpg'
        ]),
        isFeatured: true,
        categoryId: electronics.id,
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
          '/images/products/headphones-1.jpg',
          '/images/products/headphones-2.jpg'
        ]),
        isFeatured: true,
        categoryId: electronics.id,
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
          '/images/products/camera-1.jpg',
          '/images/products/camera-2.jpg'
        ]),
        isFeatured: true,
        categoryId: electronics.id,
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
          '/images/products/tshirt-1.jpg',
          '/images/products/tshirt-2.jpg'
        ]),
        isFeatured: false,
        categoryId: clothing.id,
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
          '/images/products/jeans-1.jpg',
          '/images/products/jeans-2.jpg'
        ]),
        isFeatured: false,
        categoryId: clothing.id,
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
          '/images/products/jacket-1.jpg',
          '/images/products/jacket-2.jpg'
        ]),
        isFeatured: true,
        categoryId: clothing.id,
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
          '/images/products/chair-1.jpg',
          '/images/products/chair-2.jpg'
        ]),
        isFeatured: false,
        categoryId: home.id,
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
          '/images/products/yoga-mat-1.jpg',
          '/images/products/yoga-mat-2.jpg'
        ]),
        isFeatured: false,
        categoryId: sports.id,
      },
    ],
  });

  // Create suppliers
  await prisma.supplier.createMany({
    data: [
      {
        name: 'TechGear Solutions',
        email: 'info@techgear.com',
        phone: '+1-555-0123',
        company: 'TechGear Solutions Inc.',
        region: 'North America',
        country: 'United States',
      },
      {
        name: 'Fashion Hub',
        email: 'contact@fashionhub.com',
        phone: '+44-20-1234-5678',
        company: 'Fashion Hub Ltd.',
        region: 'Europe',
        country: 'United Kingdom',
      },
      {
        name: 'Global Sports',
        email: 'sales@globalsports.com',
        phone: '+61-2-9876-5432',
        company: 'Global Sports Pty Ltd',
        region: 'Australia',
        country: 'Australia',
      },
      {
        name: 'Home Essentials',
        email: 'info@homeessentials.ae',
        phone: '+971-4-123-4567',
        company: 'Home Essentials FZE',
        region: 'Middle East',
        country: 'UAE',
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