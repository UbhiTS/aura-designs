import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  // Candles
  {
    name: 'Lavender Dreams',
    description: 'A soothing hand-poured soy candle with notes of French lavender, vanilla, and a hint of chamomile. Perfect for relaxation and unwinding after a long day.',
    price: 28.00,
    category: 'candles',
    featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1602607203329-63ce340f8b96?w=800&q=80', alt: 'Lavender candle in glass jar' },
      { url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80', alt: 'Lavender candle lit' },
    ],
  },
  {
    name: 'Midnight Rose',
    description: 'An enchanting blend of Bulgarian rose, dark musk, and sandalwood. This luxurious candle creates an atmosphere of elegance and romance.',
    price: 34.00,
    category: 'candles',
    featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1596568006373-f4ef7edd8fbb?w=800&q=80', alt: 'Rose scented candle' },
    ],
  },
  {
    name: 'Ocean Breeze',
    description: 'Fresh sea salt, driftwood, and white tea combine to bring the tranquility of the ocean into your home. Clean and refreshing.',
    price: 26.00,
    category: 'candles',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1599446220577-cf69f1f6a77c?w=800&q=80', alt: 'Blue ocean candle' },
    ],
  },
  {
    name: 'Autumn Harvest',
    description: 'Warm notes of cinnamon, apple cider, and clove create the perfect cozy autumn ambiance. A seasonal favorite.',
    price: 28.00,
    category: 'candles',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800&q=80', alt: 'Autumn scented candle' },
    ],
  },

  // Home Decor
  {
    name: 'Geometric Planter Set',
    description: 'Modern concrete planters in three sizes, perfect for succulents and small houseplants. Minimalist design that complements any space.',
    price: 45.00,
    category: 'decor',
    featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80', alt: 'Geometric concrete planters' },
      { url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80', alt: 'Succulent in planter' },
    ],
  },
  {
    name: 'Woven Wall Hanging',
    description: 'Handcrafted macramé wall hanging made with 100% cotton rope. Adds bohemian charm and texture to any room.',
    price: 65.00,
    category: 'decor',
    featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', alt: 'Macrame wall hanging' },
    ],
  },
  {
    name: 'Ceramic Vase Trio',
    description: 'Set of three handmade ceramic vases in complementary earth tones. Each piece is unique with subtle variations.',
    price: 55.00,
    category: 'decor',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', alt: 'Ceramic vases' },
    ],
  },
  {
    name: 'Marble Tray',
    description: 'Elegant white marble tray with gold handles. Perfect for displaying candles, jewelry, or as a serving piece.',
    price: 48.00,
    category: 'decor',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', alt: 'Marble decorative tray' },
    ],
  },

  // Gifts
  {
    name: 'Self-Care Gift Box',
    description: 'A curated collection including a lavender candle, bath salts, silk eye mask, and handwritten affirmation cards. The perfect gift for someone special.',
    price: 85.00,
    category: 'gifts',
    featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800&q=80', alt: 'Self care gift box' },
      { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80', alt: 'Gift box contents' },
    ],
  },
  {
    name: 'Cozy Night In Bundle',
    description: 'Everything you need for a perfect cozy evening: vanilla candle, soft throw blanket, gourmet hot cocoa mix, and a ceramic mug.',
    price: 72.00,
    category: 'gifts',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1544376798-76a87a1f0952?w=800&q=80', alt: 'Cozy gift bundle' },
    ],
  },
  {
    name: 'New Home Gift Set',
    description: 'Welcome someone to their new home with this thoughtful set: reed diffuser, decorative matches, linen spray, and a potted succulent.',
    price: 68.00,
    category: 'gifts',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80', alt: 'New home gift set' },
    ],
  },
  {
    name: 'Birthday Celebration Box',
    description: 'Make their birthday extra special with a festive candle, confetti bath bomb, birthday cake tea, and a beautiful greeting card.',
    price: 58.00,
    category: 'gifts',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Birthday gift box' },
    ],
  },

  // Photos (Display prints/frames)
  {
    name: 'Botanical Print Set',
    description: 'Set of four vintage-inspired botanical illustrations printed on premium matte paper. Frames not included.',
    price: 42.00,
    category: 'photos',
    featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Botanical prints' },
    ],
  },
  {
    name: 'Minimalist Art Prints',
    description: 'Abstract line art prints in black and white. Set of three designs that create a cohesive gallery wall.',
    price: 38.00,
    category: 'photos',
    featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=800&q=80', alt: 'Minimalist art prints' },
    ],
  },
];

async function main() {
  console.log('🌱 Starting to seed database...\n');

  // Clear existing data
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  console.log('✓ Cleared existing products and images\n');

  // Create products with images
  for (const productData of sampleProducts) {
    const { images, ...product } = productData;
    
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            order: index,
          })),
        },
      },
      include: { images: true },
    });

    console.log(`✓ Created: ${createdProduct.name} (${createdProduct.images.length} images)`);
  }

  console.log('\n✨ Seeding completed successfully!');
  console.log(`   Total products: ${sampleProducts.length}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
