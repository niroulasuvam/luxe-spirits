import { IProductRepository } from "../repositories/product.repository";
import { ICategoryRepository } from "../repositories/category.repository";
import { IBrandRepository } from "../repositories/brand.repository";
import { INotificationRepository } from "../repositories/notification.repository";
import { IUserRepository } from "../repositories/user.repository";
import { CreateProductDTO, UpdateProductDTO, ListProductsQueryDTO } from "../dtos/product.dto";
import { CustomHttpException } from "../exceptions/http-exception";
import { CLIENT_URL, GEMINI_API_KEY, GEMINI_MODEL } from "../configs/constant";

export class ProductService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly categoryRepo: ICategoryRepository,
    private readonly brandRepo: IBrandRepository,
    private readonly notificationRepo: INotificationRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async listProducts(query: ListProductsQueryDTO) {
    let categoryId: string | undefined;
    let brandId: string | undefined;

    if (query.category) {
      const category = await this.categoryRepo.findBySlug(query.category);
      categoryId = category?._id.toString() || "__none__";
    }
    if (query.brand) {
      const brand = await this.brandRepo.findBySlug(query.brand);
      brandId = brand?._id.toString() || "__none__";
    }

    return await this.productRepo.findAll({
      categoryId,
      brandId,
      search: query.search,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice
    });
  }

  async aiSearch(prompt: string) {
    const cleanedPrompt = prompt.trim();
    if (!cleanedPrompt) {
      throw new CustomHttpException(400, "Tell AI what liquor you are looking for");
    }
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_GEMINI_API_KEY_HERE") {
      throw new CustomHttpException(500, "Gemini API key is not configured");
    }

    const products = await this.productRepo.findAll({});
    const inventory = products.slice(0, 80).map((product) => ({
      id: product._id.toString(),
      name: product.name,
      category: (product.categoryId as any)?.name || "",
      brand: (product.brandId as any)?.name || "",
      price: product.price,
      oldPrice: product.oldPrice,
      abv: product.abv,
      origin: product.origin,
      notes: product.notes,
      description: product.description
    }));

    const instruction = `
You are the Liquor Hub liquor search assistant.
Use only this inventory. Return JSON only, no markdown.
Choose up to 8 product ids that best match the customer request.
JSON shape:
{"answer":"short helpful answer","productIds":["id1"],"filters":{"maxPrice":number|null,"category":string|null}}

Customer request: ${cleanedPrompt}
Inventory: ${JSON.stringify(inventory)}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: instruction }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = "Gemini AI search failed";
      try {
        const errorData = JSON.parse(errorText);
        message = errorData?.error?.message || message;
      } catch {
        if (errorText) message = errorText;
      }
      throw new CustomHttpException(response.status, message);
    }

    const data = await response.json() as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    let parsed: { answer?: string; productIds?: string[]; filters?: { maxPrice?: number | null; category?: string | null } } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { answer: text, productIds: [] };
    }

    const selectedIds = new Set((parsed.productIds || []).map(String));
    const matchedProducts = products.filter((product) => selectedIds.has(product._id.toString()));

    return {
      answer: parsed.answer || "Here are the liquors that best match your request.",
      filters: parsed.filters || {},
      products: matchedProducts
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }
    return product;
  }

  async getProductsByIds(ids: string[]) {
    return await this.productRepo.findByIds(ids);
  }

  private async assertCategoryAndBrandExist(categoryId: string, brandId: string) {
    const [category, brand] = await Promise.all([
      this.categoryRepo.findById(categoryId),
      this.brandRepo.findById(brandId)
    ]);
    if (!category) throw new CustomHttpException(400, "Category not found");
    if (!brand) throw new CustomHttpException(400, "Brand not found");
  }

  async createProduct(data: CreateProductDTO) {
    await this.assertCategoryAndBrandExist(data.categoryId, data.brandId);
    const product = await this.productRepo.create(data);
    await this.notifyUsersAboutNewProduct(product.name, product.slug);
    return product;
  }

  private async notifyUsersAboutNewProduct(productName: string, slug: string) {
    const users = await this.userRepo.findAll();
    const activeCustomers = users.filter((user) => user.role === "user" && user.isActive);
    if (activeCustomers.length === 0) return;

    await this.notificationRepo.createMany(
      activeCustomers.map((user) => ({
        userId: user._id,
        title: "New liquor added",
        message: `${productName} is now available in Liquor Hub.`,
        href: `${CLIENT_URL}/product/${slug}`
      } as any))
    );
  }

  async updateProduct(id: string, updates: UpdateProductDTO) {
    if (updates.categoryId || updates.brandId) {
      const existing = await this.productRepo.findById(id);
      if (!existing) {
        throw new CustomHttpException(404, "Product not found");
      }
      await this.assertCategoryAndBrandExist(
        updates.categoryId || existing.categoryId.toString(),
        updates.brandId || existing.brandId.toString()
      );
    }

    const updated = await this.productRepo.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Product not found");
    }
    return updated;
  }

  async deleteProduct(id: string) {
    const deleted = await this.productRepo.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Product not found");
    }
    return deleted;
  }
}
