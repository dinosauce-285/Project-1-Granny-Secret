import { z } from "zod";

export const CreateRecipeSchema = z.object({
  title: z.string().min(1, "Recipe title is required").max(500),

  image: z.any().refine((file) => file, "Recipe image is required"),

  prepTime: z.coerce.number().int().positive("Prep time must be positive"),

  cookTime: z.coerce.number().int().positive("Cook time must be positive"),

  servings: z.coerce.number().int().positive("Servings must be positive"),

  spiciness: z.coerce.number().int().min(0).max(5, "Spiciness must be 0-5"),

  difficulty: z.string().min(1, "Please select a difficulty level"),

  category: z.string().min(1, "Please select a category"),

  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        amount: z.string().optional(),
        unit: z.string().optional(),
      })
    )
    .min(1, "At least one ingredient is required"),

  steps: z
    .array(z.string().min(1, "Step description is required"))
    .min(1, "At least one step is required"),

  note: z.string().optional(),
});
