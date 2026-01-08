import Product from "../models/Product.js";

export class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async addProduct(name, category, quantity, price) {
    const productData = {
      name,
      category,
      quantity: Number(quantity),
      price: Number(price),
    };
    const created = await this.repository.create(productData);
    return new Product(
      created.id,
      created.name,
      created.category,
      created.quantity,
      created.price
    );
  }

  async listProducts() {
    const products = await this.repository.findAll();
    return products.map(
      (p) => new Product(p.id, p.name, p.category, p.quantity, p.price)
    );
  }

  async updateProduct(id, fields) {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new Error("Produto não encontrado.");
    }
    const updatedData = { ...current, ...fields };
    const updated = await this.repository.update(id, updatedData);
    return new Product(
      updated.id,
      updated.name,
      updated.category,
      updated.quantity,
      updated.price
    );
  }

  async deleteProduct(id) {
    const success = await this.repository.delete(id);
    if (!success) {
      throw new Error("Produto não encontrado para exclusão.");
    }
  }

  async searchProduct(query) {
    if (!isNaN(Number(query))) {
      const product = await this.repository.findById(query);
      return product
        ? [
            new Product(
              product.id,
              product.name,
              product.category,
              product.quantity,
              product.price
            ),
          ]
        : [];
    } else {
      const products = await this.repository.findAll();
      return products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .map((p) => new Product(p.id, p.name, p.category, p.quantity, p.price));
    }
  }
}
