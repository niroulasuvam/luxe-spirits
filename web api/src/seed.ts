import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { DATABASE_URL } from "./configs/constant";
import { CategoryCollection } from "./models/category.model";
import { BrandCollection } from "./models/brand.model";
import { ProductCollection } from "./models/product.model";
import { UserCollection } from "./models/user.model";

const CATEGORIES = [
  { name: "Scotch Whisky", slug: "scotch-whisky", description: "Single malt scotch aged in oak casks." },
  { name: "Whisky", slug: "whisky", description: "World whiskies outside of Scotland's scotch region." },
  { name: "Vodka", slug: "vodka", description: "Clean and smooth vodkas for cocktails and sipping." },
  { name: "Rum", slug: "rum", description: "Solera and aged rums from the Caribbean and beyond." },
  { name: "Gin", slug: "gin", description: "Botanical and craft gins." }
];

const BRAND = {
  name: "Luxe Spirits Distillery",
  slug: "luxe-spirits-distillery",
  origin: "Highlands, Scotland",
  description: "The independent distillery behind every bottle in the Luxe Spirits collection."
};

const PRODUCTS = [
  {
    slug: "aethelred-25-year-scotch",
    name: "Aethelred 25 Year Scotch",
    categorySlug: "scotch-whisky",
    origin: "Speyside, Scotland",
    age: "25 Years",
    price: 54240,
    oldPrice: 63900,
    rating: 4.9,
    reviewCount: 128,
    badge: "Vintage",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=900&h=900&fit=crop",
    notes: ["Smoky Oak", "Dried Apricot", "Vanilla Bean", "Sea Salt"],
    abv: "46.5%",
    description:
      "Matured for a quarter-century in hand-selected Oloroso sherry casks, this expression captures the quiet depth of Speyside with dark chocolate, orange peel, and a mineral finish."
  },
  {
    slug: "islay-peat-reserve",
    name: "Islay Peat Reserve",
    categorySlug: "scotch-whisky",
    origin: "Islay, Scotland",
    age: "18 Years",
    price: 38400,
    rating: 4.8,
    reviewCount: 122,
    badge: "Vintage",
    image: "https://images.unsplash.com/photo-1527281400683-1aae77877b3b?w=800&h=800&fit=crop",
    notes: ["Sea Smoke", "Medicinal", "Citrus"],
    abv: "48%",
    description: "A coastal malt with peat smoke, bright citrus, and a long salted-caramel finish."
  },
  {
    slug: "nordic-cask-12-year",
    name: "Nordic Cask 12 Year",
    categorySlug: "whisky",
    origin: "Norway",
    age: "12 Years",
    price: 12800,
    oldPrice: 15600,
    rating: 4.7,
    reviewCount: 91,
    badge: "Discount",
    image: "https://images.unsplash.com/photo-1606765962248-7ff407b51667?w=800&h=800&fit=crop",
    notes: ["Honey", "Pine", "Pepper"],
    abv: "43%",
    description: "A composed northern whisky with clean oak, forest spice, and honeyed grain."
  },
  {
    slug: "caribbean-solera-15",
    name: "Caribbean Solera",
    categorySlug: "rum",
    origin: "Barbados",
    age: "15 Years",
    price: 9200,
    rating: 4.6,
    reviewCount: 65,
    badge: "Boutique",
    image: "https://images.unsplash.com/photo-1611571940159-425a28706d6f?w=800&h=800&fit=crop",
    notes: ["Molasses", "Banana", "Clove"],
    abv: "42%",
    description: "A warm solera rum layered with toasted sugar, tropical fruit, and dry spice."
  },
  {
    slug: "sakura-gin-limited",
    name: "Sakura Gin",
    categorySlug: "gin",
    origin: "Japan",
    age: "New Release",
    price: 7800,
    oldPrice: 9600,
    rating: 4.5,
    reviewCount: 310,
    badge: "Limited Discount",
    image: "https://images.unsplash.com/photo-1605270012917-bf157c5a9541?w=800&h=800&fit=crop",
    notes: ["Cherry", "Juniper", "Tea"],
    abv: "41%",
    description: "A delicate botanical gin with cherry blossom, green tea, and crisp juniper."
  },
  {
    slug: "himalayan-snow-vodka",
    name: "Himalayan Snow Vodka",
    categorySlug: "vodka",
    origin: "Kathmandu, Nepal",
    age: "Triple Filtered",
    price: 4200,
    rating: 4.4,
    reviewCount: 74,
    badge: "Crystal Clean",
    image: "https://images.unsplash.com/photo-1608885898957-a8d5da5f3f6e?w=800&h=800&fit=crop",
    notes: ["Mineral", "Citrus Peel", "Clean Finish"],
    abv: "40%",
    description: "A crisp mountain-style vodka with bright citrus lift and a polished mineral finish."
  },
  {
    slug: "royal-sherry-cask-30-year",
    name: "Royal Sherry Cask 30 Year",
    categorySlug: "scotch-whisky",
    origin: "Highlands, Scotland",
    age: "30 Years",
    price: 88480,
    oldPrice: 102000,
    rating: 5,
    reviewCount: 47,
    badge: "Vintage Discount",
    image: "https://images.unsplash.com/photo-1582819509237-d5b75d061d8d?w=900&h=900&fit=crop",
    notes: ["Fig", "Walnut", "Dark Chocolate", "Sherry Spice"],
    abv: "45.8%",
    description: "A deep Highland vintage matured in sherry casks with fig, walnut, polished oak, and a long chocolate finish."
  },
  {
    slug: "jamaican-navy-rum",
    name: "Jamaican Navy Rum",
    categorySlug: "rum",
    origin: "Jamaica",
    age: "8 Years",
    price: 6500,
    oldPrice: 8200,
    rating: 4.5,
    reviewCount: 143,
    badge: "Discount",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&h=800&fit=crop",
    notes: ["Brown Sugar", "Overripe Banana", "Allspice"],
    abv: "44%",
    description: "A bold Jamaican rum with rich ester fruit, brown sugar depth, and a dry spiced finish."
  },
  {
    slug: "london-dry-crown-gin",
    name: "London Dry Crown Gin",
    categorySlug: "gin",
    origin: "London, England",
    age: "Classic Dry",
    price: 5600,
    rating: 4.3,
    reviewCount: 98,
    badge: "Classic",
    image: "https://images.unsplash.com/photo-1563223771-375783ee91ad?w=800&h=800&fit=crop",
    notes: ["Juniper", "Coriander", "Lemon Zest"],
    abv: "42%",
    description: "A sharp London dry gin built for clean martinis, tonic, and citrus-forward cocktails."
  },
  {
    slug: "yamazaki-mizunara-18",
    name: "Yamazaki Mizunara 18",
    categorySlug: "whisky",
    origin: "Osaka, Japan",
    age: "18 Years",
    price: 46200,
    rating: 4.9,
    reviewCount: 82,
    badge: "Vintage",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=900&h=900&fit=crop",
    notes: ["Sandalwood", "Honey", "Orange Peel", "Incense"],
    abv: "43%",
    description: "A Japanese vintage whisky shaped by Mizunara oak, delicate spice, honeyed malt, and fragrant incense."
  }
];

async function seed() {
  await mongoose.connect(DATABASE_URL);
  console.log("Connected. Seeding categories, brand, and products...");

  const categoryIdBySlug = new Map<string, mongoose.Types.ObjectId>();
  for (const category of CATEGORIES) {
    const doc = await CategoryCollection.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true, returnDocument: "after" }
    );
    categoryIdBySlug.set(category.slug, doc!._id);
    console.log(`Category ready: ${category.name}`);
  }

  const brand = await BrandCollection.findOneAndUpdate(
    { slug: BRAND.slug },
    { $set: BRAND },
    { upsert: true, returnDocument: "after" }
  );
  console.log(`Brand ready: ${BRAND.name}`);

  for (const product of PRODUCTS) {
    const { categorySlug, ...productData } = product;
    const categoryId = categoryIdBySlug.get(categorySlug);
    await ProductCollection.findOneAndUpdate(
      { slug: product.slug },
      { $set: { ...productData, categoryId, brandId: brand!._id } },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`Product ready: ${product.name}`);
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await UserCollection.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL },
      {
        $set: {
          fullName: process.env.ADMIN_NAME || "Luxe Admin",
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          ageVerified: true,
          role: "admin",
          isActive: true
        }
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`Admin ready: ${process.env.ADMIN_EMAIL}`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
