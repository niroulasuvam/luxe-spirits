import { CategoryCollection } from "../models/category.model";

const DEFAULT_CATEGORIES = [
  { name: "Scotch Whisky", slug: "scotch-whisky", description: "Single malt scotch aged in oak casks." },
  { name: "Whisky", slug: "whisky", description: "World whiskies outside of Scotland's scotch region." },
  { name: "Vodka", slug: "vodka", description: "Clean and smooth vodkas for cocktails and sipping." },
  { name: "Rum", slug: "rum", description: "Solera and aged rums from the Caribbean and beyond." },
  { name: "Gin", slug: "gin", description: "Botanical and craft gins." }
];

export async function ensureDefaultCategories() {
  for (const category of DEFAULT_CATEGORIES) {
    await CategoryCollection.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true }
    );
  }
}
