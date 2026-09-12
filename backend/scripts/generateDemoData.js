import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

// Downloads a file from the provided URL and writes it to disk
const downloadImage = async (url, outputPath) => {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
};

// Generates a deterministic did string with given prefix and index
const generateItemDid = (prefix, index) => {
  const padded = String(index).padStart(4, '0');
  return `${prefix}-${padded}`;
};

// Executes the demo data extraction, asset downloads, and json generation
const executeDataGeneration = async () => {
  const uploadDir = path.join(backendDir, 'upload');
  const uploadsDir = path.join(backendDir, 'uploads');
  const dataDir = path.join(backendDir, 'data');

  [
    path.join(uploadDir, 'products'),
    path.join(uploadDir, 'categories'),
    path.join(uploadDir, 'hero'),
    path.join(uploadsDir, 'products'),
    path.join(uploadsDir, 'categories'),
    path.join(uploadsDir, 'hero'),
    dataDir,
  ].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const categoriesRaw = [
    {
      id: 'Bags',
      name: 'Bags',
      slug: 'bags',
      objectId: '673a00000000000000000001',
      did: 'CAT-BAGS0001',
      description: 'Stylish and functional backpacks, totes, and purses for everyday use.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
    },
    {
      id: 'Wallet',
      name: 'Wallet',
      slug: 'wallet',
      objectId: '673a00000000000000000002',
      did: 'CAT-WALL0002',
      description: 'Compact and minimalist leather wallets and coin pouches.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
    },
    {
      id: 'Keychains',
      name: 'Keychains',
      slug: 'keychains',
      objectId: '673a00000000000000000003',
      did: 'CAT-KEYC0003',
      description: 'Tactile plush pendants and durable enamel keychain charms.',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
    },
    {
      id: 'Tshirts',
      name: 'Tshirts',
      slug: 'tshirts',
      objectId: '673a00000000000000000004',
      did: 'CAT-TSHR0004',
      description: 'Premium heavyweight and combed cotton graphic t-shirts.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
    },
  ];

  const heroSlidesRaw = [
    {
      id: 1,
      title: 'Style Meets Everyday Essentials',
      subtitle: 'Discover unique bags, wallets, keychains and t-shirts crafted for your lifestyle.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fm=webp&fit=crop&w=1920&q=80',
      badge: 'NEW COLLECTION',
    },
    {
      id: 2,
      title: 'Crafted with Precision & Passion',
      subtitle: 'Minimalist aesthetics and functional design engineered for modern individuals.',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fm=webp&fit=crop&w=1920&q=80',
      badge: 'PREMIUM QUALITY',
    },
    {
      id: 3,
      title: 'Digital Dreams In Physical Form',
      subtitle: 'Demonstrating seamless web craftsmanship and high-performance digital commerce.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fm=webp&fit=crop&w=1920&q=80',
      badge: 'PLEXIVIA DEMO',
    },
  ];

  const productsRaw = [
    {
      id: 'tote-bag',
      name: 'Tote Bag',
      category: 'Bags',
      price: 1250,
      offerPrice: null,
      sku: 'DEMO-BG-001',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Stylish and durable tote bag with a modern design. Perfect for everyday use.',
      features: ['100% heavy canvas cotton', 'Reinforced shoulder straps', 'Internal zippered pocket', 'Eco-friendly fabrication'],
      inStock: true,
      stockAmount: 50,
      featured: true,
      tags: ['bags', 'tote bag', 'canvas', 'accessories', 'lifestyle'],
    },
    {
      id: 'nature-designed-tote-bag',
      name: 'Nature Designed Tote Bag',
      category: 'Bags',
      price: 1250,
      offerPrice: null,
      sku: 'DEMO-BG-002',
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Botanical foliage print canvas bag designed for mindful daily errands and shopping.',
      features: ['Organic botanical screen print', 'Durable woven handles', 'Spacious open compartment'],
      inStock: true,
      stockAmount: 40,
      featured: false,
      tags: ['bags', 'nature', 'tote bag', 'organic', 'botanical'],
    },
    {
      id: 'ladies-purse',
      name: 'Ladies Purse',
      category: 'Bags',
      price: 1650,
      offerPrice: null,
      sku: 'DEMO-BG-003',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Contemporary structured ladies handbag with premium metal accents and shoulder strap.',
      features: ['Fine textured vegan leather', 'Dual interior partitions', 'Gold-finish hardware'],
      inStock: true,
      stockAmount: 35,
      featured: false,
      tags: ['bags', 'purse', 'ladies purse', 'leather', 'fashion'],
    },
    {
      id: 'laptop-bag',
      name: 'Laptop Bag',
      category: 'Bags',
      price: 2250,
      offerPrice: null,
      sku: 'DEMO-BG-004',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Water-repellent commuter laptop carrier with shock-absorbing foam padding.',
      features: ['Fits up to 15.6 inch laptops', 'Dedicated accessory slots', 'Padded ergonomic strap'],
      inStock: true,
      stockAmount: 25,
      featured: false,
      tags: ['bags', 'laptop bag', 'office', 'travel', 'commute'],
    },
    {
      id: 'cute-schoolbag',
      name: 'Cute Schoolbag',
      category: 'Bags',
      price: 1850,
      offerPrice: null,
      sku: 'DEMO-BG-005',
      image: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Comfortable pastel backpack featuring ergonomic straps and organized storage.',
      features: ['Multi-tier zip compartments', 'Breathable mesh back panel', 'Lightweight water-resistant fabric'],
      inStock: true,
      stockAmount: 30,
      featured: false,
      tags: ['bags', 'backpack', 'schoolbag', 'cute', 'travel'],
    },
    {
      id: 'kawaii-mini-purse',
      name: 'Kawaii Mini Purse',
      category: 'Wallet',
      price: 950,
      offerPrice: null,
      sku: 'DEMO-WL-001',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Charming compact pouch purse crafted for quick coins, cards, and keys.',
      features: ['Compact palm-sized form', 'Smooth metallic zipper', 'Durable inner lining'],
      inStock: true,
      stockAmount: 45,
      featured: true,
      tags: ['wallet', 'mini purse', 'kawaii', 'coins', 'compact'],
    },
    {
      id: 'coin-purse',
      name: 'Coin Purse',
      category: 'Wallet',
      price: 750,
      offerPrice: null,
      sku: 'DEMO-WL-002',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Minimalist pocket leather coin purse with clean edges and secure closure.',
      features: ['Genuine textured finish', 'Quick-access snap clasp', 'Slim pocket profile'],
      inStock: true,
      stockAmount: 50,
      featured: false,
      tags: ['wallet', 'coin purse', 'leather', 'pocket', 'minimalist'],
    },
    {
      id: 'men-wallet',
      name: 'Men Wallet',
      category: 'Wallet',
      price: 1250,
      offerPrice: null,
      sku: 'DEMO-WL-003',
      image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Classic dark leather bifold wallet with multi-card slots and bill divider.',
      features: ['RFID protection shield', '8 card slots + dual currency fold', 'Slim hand-stitched border'],
      inStock: true,
      stockAmount: 40,
      featured: false,
      tags: ['wallet', 'men wallet', 'bifold', 'leather', 'rfid'],
    },
    {
      id: 'leather-long-wallet',
      name: 'Leather Long Wallet',
      category: 'Wallet',
      price: 1750,
      offerPrice: null,
      sku: 'DEMO-WL-004',
      image: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Refined long organizer wallet tailored for checkbooks, cards, and cash.',
      features: ['12 card slots', 'Zippered coin sleeve', 'Premium matte leather exterior'],
      inStock: true,
      stockAmount: 20,
      featured: false,
      tags: ['wallet', 'long wallet', 'organizer', 'leather', 'premium'],
    },
    {
      id: 'cute-bunny-keychain',
      name: 'Cute Bunny Keychain',
      category: 'Keychains',
      price: 680,
      offerPrice: null,
      sku: 'DEMO-KC-001',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Soft tactile plush bunny charm attached to an alloy swivel clip.',
      features: ['Ultra-soft plush finish', 'Sturdy metal swivel ring', 'Lightweight bag accessory'],
      inStock: true,
      stockAmount: 60,
      featured: true,
      tags: ['keychains', 'bunny', 'plush', 'charm', 'cute'],
    },
    {
      id: 'kuromi-premium-plush',
      name: 'Kuromi Premium Plush',
      category: 'Keychains',
      price: 1200,
      offerPrice: null,
      sku: 'DEMO-KC-002',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Detailed collector plush pendant with signature aesthetic styling.',
      features: ['High-density velvet plush', 'Precision embroidery', 'Collector clasp'],
      inStock: true,
      stockAmount: 25,
      featured: false,
      tags: ['keychains', 'kuromi', 'plush', 'collector', 'aesthetic'],
    },
    {
      id: 'black-cat-keychain-pendant',
      name: 'Black Cat Keychain Pendant',
      category: 'Keychains',
      price: 620,
      offerPrice: null,
      sku: 'DEMO-KC-003',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Sleek black feline charm pendant with polished dark enamel finish.',
      features: ['Solid zinc alloy base', 'Gloss enamel coating', 'Anti-rust key loop'],
      inStock: true,
      stockAmount: 40,
      featured: false,
      tags: ['keychains', 'black cat', 'enamel', 'pendant', 'charm'],
    },
    {
      id: 'hello-kitty-designed',
      name: 'Hello Kitty Designed',
      category: 'Tshirts',
      price: 1450,
      offerPrice: null,
      sku: 'DEMO-TS-001',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Soft combed cotton pastel t-shirt with classic playful character artwork.',
      features: ['100% bio-washed combed cotton', 'High-definition screen print', 'Pre-shrunk regular fit'],
      inStock: true,
      stockAmount: 35,
      featured: true,
      tags: ['tshirts', 'hello kitty', 'cotton', 'casual', 'graphic tee'],
    },
    {
      id: 'couple-tshirt-pair',
      name: 'Couple Tshirt Pair',
      category: 'Tshirts',
      price: 2450,
      offerPrice: null,
      sku: 'DEMO-TS-002',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Coordinated set of 2 premium unisex t-shirts crafted for matching comfort.',
      features: ['Set of two matching tees', 'Breathable lightweight weave', 'Ribbed crew collar'],
      inStock: true,
      stockAmount: 20,
      featured: false,
      tags: ['tshirts', 'couple', 'matching', 'pair', 'unisex'],
    },
    {
      id: 'jojo-soso-drop-shoulder',
      name: 'Jojo Soso Drop Shoulder',
      category: 'Tshirts',
      price: 1650,
      offerPrice: null,
      sku: 'DEMO-TS-003',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fm=webp&fit=crop&w=800&h=800&q=80',
      description: 'Heavyweight oversized drop-shoulder tee with relaxed contemporary drape.',
      features: ['240 GSM heavy cotton', 'Relaxed boxy silhouette', 'Drop shoulder seams'],
      inStock: true,
      stockAmount: 30,
      featured: false,
      tags: ['tshirts', 'drop shoulder', 'oversized', 'streetwear', 'heavyweight'],
    },
  ];

  console.log('Downloading category images...');
  const categoryMap = new Map();
  for (let i = 0; i < categoriesRaw.length; i++) {
    const cat = categoriesRaw[i];
    const filename = `${cat.slug}.webp`;
    const dest1 = path.join(uploadDir, 'categories', filename);
    const dest2 = path.join(uploadsDir, 'categories', filename);
    await downloadImage(cat.image, dest1);
    fs.copyFileSync(dest1, dest2);
    categoryMap.set(cat.id, {
      _id: cat.objectId,
      name: cat.name,
      slug: cat.slug,
      did: cat.did,
      description: cat.description,
      imageUrl: `/upload/categories/${filename}`,
      productCount: productsRaw.filter((p) => p.category === cat.id).length,
      parent: null,
      createdBy: '6a7e1cb910f06c8eb4ea0a66',
      updatedBy: null,
      createdAt: '2026-09-13T00:00:00.000Z',
      updatedAt: '2026-09-13T00:00:00.000Z',
    });
    console.log(`Saved category image: ${filename}`);
  }

  console.log('Downloading hero banner images...');
  for (let i = 0; i < heroSlidesRaw.length; i++) {
    const slide = heroSlidesRaw[i];
    const filename = `slide-${slide.id}.webp`;
    const dest1 = path.join(uploadDir, 'hero', filename);
    const dest2 = path.join(uploadsDir, 'hero', filename);
    await downloadImage(slide.image, dest1);
    fs.copyFileSync(dest1, dest2);
    console.log(`Saved hero banner image: ${filename}`);
  }

  console.log('Downloading product images and formatting demo products...');
  const demoProducts = [];
  for (let i = 0; i < productsRaw.length; i++) {
    const prod = productsRaw[i];
    const filename = `${prod.id}.webp`;
    const dest1 = path.join(uploadDir, 'products', filename);
    const dest2 = path.join(uploadsDir, 'products', filename);
    await downloadImage(prod.image, dest1);
    fs.copyFileSync(dest1, dest2);

    const catObj = categoryMap.get(prod.category);
    const did = generateItemDid('PRD-DEMO', i + 1);
    const hexIndex = (i + 1).toString(16).padStart(4, '0');
    const objectId = `673a1000000000000000${hexIndex}`;
    const imageRelPath = `/upload/products/${filename}`;

    const longDesc = `<p>${prod.description}</p><ul>${prod.features.map((f) => `<li>${f}</li>`).join('')}</ul>`;

    const productDoc = {
      _id: objectId,
      id: objectId,
      name: prod.name,
      slug: prod.id,
      did,
      description: `<p>${prod.description}</p>`,
      longDescription: longDesc,
      chargeTax: false,
      taxRate: null,
      isActive: true,
      type: 'simple',
      price: prod.price,
      offerPrice: prod.offerPrice,
      sku: prod.sku,
      variants: [],
      season: ['All-Season'],
      tags: prod.tags,
      notes: [],
      brand: [],
      categories: catObj ? [catObj] : [],
      metaData: {
        metaTitle: `${prod.name} | Demo Store`,
        metaDescription: prod.description,
        keywords: prod.tags,
        ogImage: imageRelPath,
      },
      imageUrl: imageRelPath,
      thumbnailUrl: imageRelPath,
      images: [imageRelPath],
      image_url: imageRelPath,
      thumbnail_url: imageRelPath,
      stockStatus: prod.inStock ? 'instock' : 'outofstock',
      stockAmount: prod.stockAmount,
      createdBy: '6a7e1cb910f06c8eb4ea0a66',
      updatedBy: null,
      createdAt: '2026-09-13T00:00:00.000Z',
      updatedAt: '2026-09-13T00:00:00.000Z',
    };

    demoProducts.push(productDoc);
    console.log(`Processed product [${i + 1}/15]: ${prod.name}`);
  }

  const demoCategories = Array.from(categoryMap.values());

  const demoProductsPath1 = path.join(dataDir, 'demoProducts.json');
  const demoProductsPath2 = path.join(backendDir, 'demoProducts.json');
  const demoCategoriesPath = path.join(dataDir, 'demoCategories.json');

  fs.writeFileSync(demoProductsPath1, JSON.stringify(demoProducts, null, 2), 'utf8');
  fs.writeFileSync(demoProductsPath2, JSON.stringify(demoProducts, null, 2), 'utf8');
  fs.writeFileSync(demoCategoriesPath, JSON.stringify({ status: 'success', data: demoCategories }, null, 2), 'utf8');

  console.log(`Created ${demoProducts.length} demo products successfully.`);
  console.log(`Saved: ${demoProductsPath1}`);
  console.log(`Saved: ${demoProductsPath2}`);
  console.log(`Saved: ${demoCategoriesPath}`);
};

executeDataGeneration().catch((err) => {
  console.error('Fatal error generating demo data:', err);
  process.exit(1);
});
