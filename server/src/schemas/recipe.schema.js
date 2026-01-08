import { z } from "zod";

export const recipeCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .max(1000)
    .optional()
    .nullable(),

  prepTime: z.number().int().positive().optional().nullable(),
  cookTime: z.number().int().positive().optional().nullable(),
  servings: z.number().int().positive().optional().nullable(),

  spiciness: z.number().int().min(0).max(5).optional().nullable(),

  difficulty: z.string().max(100).optional().nullable(),
  note: z.string().max(2000).optional().nullable(),

  favourite: z.boolean().default(false),

  categoryId: z.number().int().positive().optional().nullable(),

  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name required"),
        amount: z.number().optional().nullable(),
        unit: z.string().optional().nullable(),
      })
    )
    .min(1, "At least one ingredient is required"),

  steps: z
    .array(
      z.object({
        stepOrder: z.number().int().min(1),
        content: z.string().min(1, "Step content required"),
      })
    )
    .optional(),
});
