import readline from "readline";
import { z } from "zod";

export class ProductController {
  constructor(service) {
    this.service = service;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.rl.on("close", () => process.exit(0));
  }

  start() {
    this.showMenu();
  }

  showMenu() {
    console.log("\n=== Gerenciamento de Produtos - AgilStore ===");
    console.log("1. Adicionar Produto");
    console.log("2. Listar Produtos");
    console.log("3. Atualizar Produto");
    console.log("4. Excluir Produto");
    console.log("5. Buscar Produto");
    console.log("6. Sair");
    this.rl.question("Escolha uma opção: ", (option) => {
      switch (option.trim()) {
        case "1":
          this.addProduct();
          break;
        case "2":
          this.listProducts();
          break;
        case "3":
          this.updateProduct();
          break;
        case "4":
          this.deleteProduct();
          break;
        case "5":
          this.searchProduct();
          break;
        case "6":
          this.rl.close();
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
          this.showMenu();
      }
    });
  }

  async addProduct() {
    this.rl.question("Nome do Produto: ", async (name) => {
      name = name.trim();
      if (!name) {
        console.log("Nome é obrigatório.");
        return this.showMenu();
      }
      const categories = await this.getUniqueCategories();

      console.log("\nCategorias existentes no sistema:");
      if (categories.length === 0) {
        console.log("→ Ainda não existem categorias cadastradas.");
      } else {
        categories.forEach((cat, index) => {
          console.log(`[${index + 1}] ${cat}`);
        });
      }
      console.log(`[${categories.length + 1}] Criar uma nova categoria`);

      this.rl.question(
        "\nEscolha a categoria (digite o número): ",
        async (choice) => {
          let category;

          const num = parseInt(choice.trim());
          if (!isNaN(num)) {
            if (num >= 1 && num <= categories.length) {
              category = categories[num - 1];
            } else if (num === categories.length + 1) {
              category = await this.askForNewCategory();
            } else {
              console.log("Opção inválida.");
              return this.addProduct();
            }
          } else {
            console.log("Por favor, digite um número.");
            return this.addProduct();
          }

          this.rl.question("Quantidade em Estoque: ", (quantity) => {
            this.rl.question("Preço (ex: 2999.99): ", (price) => {
              try {
                const data = ProductSchema.parse({
                  name,
                  category,
                  quantity: quantity.trim(),
                  price: price.trim(),
                });

                this.service
                  .addProduct(
                    data.name,
                    data.category,
                    data.quantity,
                    data.price
                  )
                  .then(() => console.log("Produto adicionado com sucesso!"))
                  .catch((err) => console.log(`Erro: ${err.message}`))
                  .finally(() => this.showMenu());
              } catch (err) {
                if (err instanceof z.ZodError) {
                  console.log("Erro de validação:");
                  err.errors.forEach((e) => console.log(`→ ${e.message}`));
                } else {
                  console.log(`Erro: ${err.message}`);
                }
                this.showMenu();
              }
            });
          });
        }
      );
    });
  }

  async getUniqueCategories() {
    const products = await this.service.listProducts();
    const unique = new Set(products.map((p) => p.category));
    return Array.from(unique).sort();
  }

  asokForNewCategry() {
    return new Promise((resolve) => {
      this.rl.question("Digite o nome da NOVA categoria: ", (newCat) => {
        const trimmed = newCat.trim();
        if (trimmed) {
          resolve(trimmed);
        } else {
          console.log("Nome da categoria não pode ser vazio.");
          this.askForNewCategory().then(resolve);
        }
      });
    });
  }

  async listProducts() {
    try {
      const products = await this.service.listProducts();
      if (products.length === 0) {
        console.log("Nenhum produto cadastrado.");
      } else {
        console.table(
          products.map((p) => ({
            ID: p.id,
            Nome: p.name,
            Categoria: p.category,
            Quantidade: p.quantity,
            Preço: p.price,
          }))
        );
      }
    } catch (err) {
      console.log(`Erro ao listar: ${err.message}`);
    }
    this.showMenu();
  }

  updateProduct() {
    this.rl.question("ID do Produto: ", (idInput) => {
      try {
        const id = IdSchema.parse(idInput.trim());
        const fields = {};
        this.rl.question("Atualizar Nome? (y/n): ", (yn) => {
          if (yn.toLowerCase() === "y") {
            this.rl.question("Novo Nome: ", (newName) => {
              fields.name = newName.trim();
              this.updateNext("category", id, fields);
            });
          } else {
            this.updateNext("category", id, fields);
          }
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          console.log("Erro de validação no ID:");
          err.errors.forEach((e) => console.log(`- ${e.message}`));
        } else {
          console.log(`Erro: ${err.message}`);
        }
        this.showMenu();
      }
    });
  }

  updateNext(field, id, fields) {
    const questions = {
      category: {
        q: "Atualizar Categoria? (y/n): ",
        next: "quantity",
        set: "category",
      },
      quantity: {
        q: "Atualizar Quantidade? (y/n): ",
        next: "price",
        set: "quantity",
      },
      price: { q: "Atualizar Preço? (y/n): ", next: null, set: "price" },
    };
    const current = questions[field];
    if (!current) {
      return this.performUpdate(id, fields);
    }
    this.rl.question(current.q, (yn) => {
      if (yn.toLowerCase() === "y") {
        this.rl.question(
          `Novo ${field.charAt(0).toUpperCase() + field.slice(1)}: `,
          (value) => {
            fields[current.set] = value.trim();
            this.updateNext(current.next, id, fields);
          }
        );
      } else {
        this.updateNext(current.next, id, fields);
      }
    });
  }

  performUpdate(id, fields) {
    try {
      if (Object.keys(fields).length === 0) {
        console.log("Nenhuma atualização realizada.");
        return this.showMenu();
      }
      UpdateSchema.parse(fields);
      this.service
        .updateProduct(id, fields)
        .then(() => console.log("Produto atualizado com sucesso!"))
        .catch((err) => console.log(`Erro: ${err.message}`))
        .finally(() => this.showMenu());
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log("Erro de validação:");
        err.errors.forEach((e) => console.log(`- ${e.message}`));
      } else {
        console.log(`Erro: ${err.message}`);
      }
      this.showMenu();
    }
  }

  deleteProduct() {
    this.rl.question("ID do Produto: ", (idInput) => {
      try {
        const id = IdSchema.parse(idInput.trim());
        this.rl.question("Confirmar exclusão? (y/n): ", (yn) => {
          if (yn.toLowerCase() === "y") {
            this.service
              .deleteProduct(id)
              .then(() => console.log("Produto excluído com sucesso!"))
              .catch((err) => console.log(`Erro: ${err.message}`))
              .finally(() => this.showMenu());
          } else {
            this.showMenu();
          }
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          console.log("Erro de validação no ID:");
          err.errors.forEach((e) => console.log(`- ${e.message}`));
        } else {
          console.log(`Erro: ${err.message}`);
        }
        this.showMenu();
      }
    });
  }

  searchProduct() {
    this.rl.question("ID ou Nome (parcial): ", (query) => {
      if (!query.trim()) {
        console.log("Query de busca é obrigatória.");
        return this.showMenu();
      }
      this.service
        .searchProduct(query.trim())
        .then((results) => {
          if (results.length === 0) {
            console.log("Nenhum produto encontrado.");
          } else {
            console.table(
              results.map((p) => ({
                ID: p.id,
                Nome: p.name,
                Categoria: p.category,
                Quantidade: p.quantity,
                Preço: p.price,
              }))
            );
          }
        })
        .catch((err) => console.log(`Erro: ${err.message}`))
        .finally(() => this.showMenu());
    });
  }
}
