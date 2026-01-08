import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const DATABASE_PATH = path.join(DATA_DIR, "database.json");

export class ProductRepository {
  constructor() {
    this.ensureDataDirAndFile();
  }

  async ensureDataDirAndFile() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      if (!(await this.fileExists(DATABASE_PATH))) {
        await fs.writeFile(DATABASE_PATH, JSON.stringify([]), "utf8");
      }
    } catch (error) {
      console.error("Erro ao preparar o diretório de dados:", error);
    }
  }

  async fileExists(path) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(DATABASE_PATH, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveProducts(products) {
    await fs.writeFile(
      DATABASE_PATH,
      JSON.stringify(products, null, 2),
      "utf8"
    );
  }

  async findAll() {
    return await this.loadProducts();
  }

  async findById(id) {
    const products = await this.loadProducts();
    return products.find((p) => p.id === Number(id));
  }

  async create(product) {
    const products = await this.loadProducts();
    const nextId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = { id: nextId, ...product };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async update(id, updatedData) {
    const products = await this.loadProducts();
    const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedData };
    await this.saveProducts(products);
    return products[index];
  }

  async delete(id) {
    const products = await this.loadProducts();
    const filtered = products.filter((p) => p.id !== Number(id));
    if (filtered.length === products.length) return false;

    await this.saveProducts(filtered);
    return true;
  }
}
