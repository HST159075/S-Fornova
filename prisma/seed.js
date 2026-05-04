// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/lib/auth.js";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Sofas, coffee tables, TV units and more",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Beds, wardrobes, nightstands and dressers",
    image:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400",
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    description: "Dining tables, chairs and sideboards",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
  },
  {
    name: "Office",
    slug: "office",
    description: "Desks, office chairs and storage",
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    description: "Garden furniture and outdoor decor",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Floor lamps, chandeliers and wall lights",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create categories
  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.create({ data: cat });
    createdCategories.push(c);
  }
  console.log(`✅ ${createdCategories.length} categories created`);

  // Create users via Better Auth API (handles password hashing)
  const demoUsers = [
    {
      name: "Admin User",
      email: "admin@furnova.com",
      password: "admin1234",
      role: "ADMIN",
    },
    {
      name: "Manager User",
      email: "manager@furnova.com",
      password: "manager1234",
      role: "MANAGER",
    },
    {
      name: "John Doe",
      email: "user@furnova.com",
      password: "user1234",
      role: "USER",
    },
  ];

  for (const u of demoUsers) {
    const result = await auth.api.signUpEmail({
      body: { name: u.name, email: u.email, password: u.password },
    });
    if (result?.user?.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: u.role, emailVerified: true },
      });
    }
  }
  console.log("✅ 3 demo users created");

  // Get category IDs
  const catMap = {};
  createdCategories.forEach((c) => (catMap[c.slug] = c.id));

  // Create products
  const products = [
    {
      name: "Luxe Velvet Sofa",
      slug: "luxe-velvet-sofa",
      shortDescription: "Deep-seated 3-seater sofa in rich velvet",
      description:
        "Experience ultimate comfort with our Luxe Velvet Sofa. Crafted with solid hardwood frame and high-density foam cushions, this sofa blends elegance with durability. Available in multiple colors to match any interior.",
      price: 1299,
      discountPrice: 1099,
      categoryId: catMap["living-room"],
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600",
      ],
      stock: 15,
      sku: "SOF-001",
      isFeatured: true,
      material: ["Velvet", "Hardwood", "Foam"],
      colors: ["Navy Blue", "Emerald Green", "Charcoal"],
      dimensionWidth: 220,
      dimensionHeight: 85,
      dimensionDepth: 95,
      dimensionUnit: "cm",
      ratings: 4.7,
      numReviews: 34,
      sold: 120,
    },
    {
      name: "Marble Top Coffee Table",
      slug: "marble-top-coffee-table",
      shortDescription: "Italian marble top with brass legs",
      description:
        "A statement piece for any living room. The Marble Top Coffee Table features genuine Italian marble and sleek brass-finished legs for a contemporary luxe look.",
      price: 599,
      discountPrice: 499,
      categoryId: catMap["living-room"],
      images: [
        "https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=600",
      ],
      stock: 8,
      sku: "TAB-001",
      isFeatured: true,
      material: ["Marble", "Brass"],
      colors: [],
      dimensionWidth: 120,
      dimensionHeight: 45,
      dimensionDepth: 60,
      dimensionUnit: "cm",
      ratings: 4.5,
      numReviews: 18,
      sold: 65,
    },
    {
      name: "Nordic King Bed Frame",
      slug: "nordic-king-bed-frame",
      shortDescription: "Minimalist solid oak king bed",
      description:
        "The Nordic King Bed Frame embodies Scandinavian simplicity. Made from sustainably sourced solid oak with a matte finish that complements any bedroom aesthetic.",
      price: 1799,
      discountPrice: 1599,
      categoryId: catMap["bedroom"],
      images: [
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600",
      ],
      stock: 6,
      sku: "BED-001",
      isFeatured: true,
      material: ["Solid Oak"],
      colors: ["Natural Oak", "Dark Walnut"],
      dimensionWidth: 180,
      dimensionHeight: 110,
      dimensionDepth: 210,
      dimensionUnit: "cm",
      ratings: 4.8,
      numReviews: 52,
      sold: 89,
    },
    {
      name: "Walnut 6-Door Wardrobe",
      slug: "walnut-6-door-wardrobe",
      shortDescription: "Spacious wardrobe with soft-close doors",
      description:
        "Maximize your storage with this elegant 6-door wardrobe crafted from premium walnut veneer. Features integrated lighting, soft-close hinges, and adjustable shelving.",
      price: 2199,
      discountPrice: 1899,
      categoryId: catMap["bedroom"],
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      ],
      stock: 4,
      sku: "WAR-001",
      isFeatured: false,
      material: ["Walnut Veneer", "Steel"],
      colors: [],
      dimensionWidth: 240,
      dimensionHeight: 220,
      dimensionDepth: 60,
      dimensionUnit: "cm",
      ratings: 4.6,
      numReviews: 29,
      sold: 42,
    },
    {
      name: "Extendable Dining Table",
      slug: "extendable-dining-table",
      shortDescription: "Seats 6–10 with extension leaf",
      description:
        "Perfect for family gatherings and dinner parties. This extendable dining table features a smooth extension mechanism and is crafted from solid beechwood for lasting durability.",
      price: 899,
      discountPrice: 749,
      categoryId: catMap["dining-room"],
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      ],
      stock: 12,
      sku: "DIN-001",
      isFeatured: true,
      material: ["Beechwood"],
      colors: ["Natural", "White"],
      dimensionWidth: 160,
      dimensionHeight: 75,
      dimensionDepth: 90,
      dimensionUnit: "cm",
      ratings: 4.4,
      numReviews: 22,
      sold: 77,
    },
    {
      name: "Velvet Dining Chair Set (4)",
      slug: "velvet-dining-chair-set",
      shortDescription: "Upholstered velvet chairs with gold legs",
      description:
        "Add luxury to your dining space with this set of 4 velvet upholstered dining chairs. Features solid brass-finished legs and high-density foam seating for all-day comfort.",
      price: 499,
      discountPrice: 399,
      categoryId: catMap["dining-room"],
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600",
      ],
      stock: 20,
      sku: "CHA-001",
      isFeatured: false,
      material: ["Velvet", "Brass"],
      colors: ["Dusty Rose", "Sage Green", "Midnight Blue"],
      ratings: 4.3,
      numReviews: 41,
      sold: 154,
    },
    {
      name: "Ergonomic Executive Desk",
      slug: "ergonomic-executive-desk",
      shortDescription: "Spacious desk with cable management",
      description:
        "Designed for productivity. This executive desk features a wide workspace, integrated cable management, and a built-in USB charging port. Perfect for home offices.",
      price: 749,
      discountPrice: 649,
      categoryId: catMap["office"],
      images: [
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
      ],
      stock: 10,
      sku: "DES-001",
      isFeatured: true,
      material: ["MDF", "Steel"],
      colors: ["Black", "White Oak"],
      dimensionWidth: 160,
      dimensionHeight: 75,
      dimensionDepth: 80,
      dimensionUnit: "cm",
      ratings: 4.6,
      numReviews: 37,
      sold: 98,
    },
    {
      name: "Lumbar Support Office Chair",
      slug: "lumbar-support-office-chair",
      shortDescription: "Breathable mesh with adjustable lumbar",
      description:
        "Say goodbye to back pain. This premium office chair features a breathable mesh back, adjustable lumbar support, 4D armrests, and multi-tilt mechanism for long working sessions.",
      price: 449,
      discountPrice: 369,
      categoryId: catMap["office"],
      images: [
        "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600",
      ],
      stock: 18,
      sku: "CHR-001",
      isFeatured: false,
      material: ["Mesh", "Nylon", "Steel"],
      colors: ["Black", "Grey"],
      ratings: 4.7,
      numReviews: 88,
      sold: 230,
    },
    {
      name: "Teak Garden Lounger Set",
      slug: "teak-garden-lounger-set",
      shortDescription: "2-piece teak loungers with cushions",
      description:
        "Relax in style with our premium teak garden lounger set. Weather-resistant teak wood, stainless steel hardware, and thick outdoor cushions make this perfect for any patio.",
      price: 1199,
      discountPrice: 999,
      categoryId: catMap["outdoor"],
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
      ],
      stock: 5,
      sku: "OUT-001",
      isFeatured: false,
      material: ["Teak Wood", "Stainless Steel"],
      colors: ["Natural Teak"],
      ratings: 4.5,
      numReviews: 16,
      sold: 34,
    },
    {
      name: "Arc Floor Lamp",
      slug: "arc-floor-lamp",
      shortDescription: "Brass arc lamp with marble base",
      description:
        "Make a statement with this sculptural arc floor lamp. Features a genuine marble base for stability, a flexible brass arm, and a warm LED bulb for ambient lighting.",
      price: 299,
      discountPrice: 249,
      categoryId: catMap["lighting"],
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
      ],
      stock: 25,
      sku: "LMP-001",
      isFeatured: true,
      material: ["Brass", "Marble"],
      colors: ["Gold", "Black"],
      ratings: 4.8,
      numReviews: 64,
      sold: 178,
    },
    {
      name: "Rattan Accent Chair",
      slug: "rattan-accent-chair",
      shortDescription: "Boho-style rattan chair with cushion",
      description:
        "Bring natural warmth to any corner with this handwoven rattan accent chair. Comes with a reversible cushion and pairs beautifully with both modern and boho interiors.",
      price: 349,
      discountPrice: 299,
      categoryId: catMap["living-room"],
      images: [
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
      ],
      stock: 14,
      sku: "ACC-001",
      isFeatured: false,
      material: ["Rattan", "Cotton"],
      colors: ["Natural", "Black"],
      ratings: 4.4,
      numReviews: 28,
      sold: 91,
    },
    {
      name: "Floating Shelf Set (3-piece)",
      slug: "floating-shelf-set",
      shortDescription: "Set of 3 solid wood floating shelves",
      description:
        "Clean and minimal floating shelves made from solid pine with an invisible bracket system. Perfect for displaying books, plants, and decor. Easy wall mounting included.",
      price: 149,
      discountPrice: 119,
      categoryId: catMap["living-room"],
      images: [
        "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600",
      ],
      stock: 50,
      sku: "SHF-001",
      isFeatured: false,
      material: ["Pine Wood"],
      colors: ["Natural", "White", "Walnut"],
      ratings: 4.2,
      numReviews: 73,
      sold: 312,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} products created`);

  console.log("\n🎉 Seed complete!");
  console.log("\n── Demo Accounts ──────────────────────────");
  console.log("  Admin:   admin@furnova.com    / admin1234");
  console.log("  Manager: manager@furnova.com  / manager1234");
  console.log("  User:    user@furnova.com     / user1234");
  console.log("────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
