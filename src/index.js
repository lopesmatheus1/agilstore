import { ProductRepository } from "./repositories/productRepository.js";
import { ProductService } from "./services/productService.js";
import { ProductController } from "./controllers/productController.js";

const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);
controller.start();
