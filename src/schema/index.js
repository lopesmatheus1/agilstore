export const ProductSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório."),
  category: z.string().min(1, "Categoria é obrigatória."),
  quantity: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(0, "Quantidade deve ser um número inteiro não negativo.")
    ),
  price: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0, "Preço deve ser um número não negativo.")),
});

export const UpdateSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório.").optional(),
  category: z.string().min(1, "Categoria é obrigatória.").optional(),
  quantity: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(0, "Quantidade deve ser um número inteiro não negativo.")
    )
    .optional(),
  price: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0, "Preço deve ser um número não negativo."))
    .optional(),
});

export const IdSchema = z
  .string()
  .transform(Number)
  .pipe(z.number().int().positive("ID deve ser um número positivo."));
