export default class Product {
  constructor(id, name, category, quantity, price) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = parseInt(quantity);
    this.price = parseFloat(price);
  }
}
