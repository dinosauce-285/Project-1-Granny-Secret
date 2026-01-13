import { useState, useEffect } from "react";
import {
  CreateRecipeSchema,
  EditRecipeSchema,
} from "../../schemas/recipe.schema";
import ButtonPrimary from "../ui/ButtonPrimary";

function RecipeForm({ initialData = null, onSubmit, isEdit = false }) {
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", unit: "" },
  ]);
  const [steps, setSteps] = useState([""]);
  const [formData, setFormData] = useState({
    title: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    spiciness: "",
    difficulty: "",
    category: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        prepTime: initialData.prepTime || "",
        cookTime: initialData.cookTime || "",
        servings: initialData.servings || "",
        spiciness: initialData.spiciness || "",
        difficulty: initialData.difficulty || "",
        category: initialData.categoryId ? String(initialData.categoryId) : "",
        note: initialData.note || "",
      });
      setImagePreview(initialData.imageUrl || null);
      setIngredients(
        initialData.ingredients?.map((i) => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit,
        })) || [{ name: "", amount: "", unit: "" }]
      );
      setSteps(initialData.steps?.map((s) => s.content) || [""]);
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    const list = [...ingredients];
    list.splice(index, 1);
    setIngredients(list);
  };

  const handleIngredientChange = (index, field, value) => {
    const list = [...ingredients];
    list[index][field] = value;
    setIngredients(list);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index) => {
    if (steps.length === 1) return;
    const list = [...steps];
    list.splice(index, 1);
    setSteps(list);
  };

  const handleStepChange = (index, value) => {
    const list = [...steps];
    list[index] = value;
    setSteps(list);
  };

  const handleSubmit = async () => {
    try {
      const formDataRaw = {
        title: formData.title,
        prepTime: Number(formData.prepTime),
        cookTime: Number(formData.cookTime),
        servings: Number(formData.servings),
        spiciness: Number(formData.spiciness),
        difficulty: formData.difficulty,
        category: formData.category,
        note: formData.note,
        image: document.getElementById("image")?.files[0],
        ingredients: ingredients.filter((i) => i.name || i.amount || i.unit),
        steps: steps.filter((s) => s.trim()),
      };

   
      if (isEdit && !formDataRaw.image) {
        delete formDataRaw.image;
      }

      const schema = isEdit ? EditRecipeSchema : CreateRecipeSchema;
      const result = schema.safeParse(formDataRaw);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const formattedErrors = result.error.format();

        const collectErrors = (errorObj, prefix = "") => {
          Object.keys(errorObj).forEach((key) => {
            if (key === "_errors") return;
            const nested = errorObj[key];
            const currentPath = prefix ? `${prefix}.${key}` : key;

            if (nested._errors && nested._errors.length > 0) {
              fieldErrors[currentPath] = nested._errors;
            }

            collectErrors(nested, currentPath);
          });
        };

        if (formattedErrors.ingredients) {
          collectErrors(formattedErrors.ingredients, "ingredients");
        }
        if (formattedErrors.steps) {
          collectErrors(formattedErrors.steps, "steps");
        }

        setErrors(fieldErrors);
        return;
      }

      setErrors({});

      const submitData = new FormData();
      Object.keys(result.data).forEach((key) => {
        if (key === "ingredients" || key === "steps") {
          submitData.append(key, JSON.stringify(result.data[key]));
        } else if (key === "image" && result.data[key]) {
          submitData.append("image", result.data[key]);
        } else {
          submitData.append(key, result.data[key]);
        }
      });

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
  };

  return (
    <div>
      <div className="w-[95%] shadow-2xl font-inter mx-auto bg-white rounded-2xl py-4 px-4 flex flex-col space-y-10 justify-between items-start border border-dashed border-gray-300">
        <div className="title font-bold text-4xl">
          {isEdit ? "Edit Recipe" : "Create New Recipe"}
        </div>

        <div className="recipeName w-full space-y-2">
          <label htmlFor="title" className="font-medium text-2xl">
            Recipe Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={`py-2 px-2 w-full border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } outline-none rounded-md hover:border-olive transition-all duration-300`}
            type="text"
            placeholder="e.g., Delicious Spaghetti Bolognese"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
          )}

          <div className="image w-full space-y-2">
            <label htmlFor="image" className="font-medium text-2xl">
              Recipe Image
            </label>
            <div className="py-2">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="block mt-1 cursor-pointer"
                aria-label="Upload image"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-[25rem] object-contain rounded-lg border border-gray-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-sm border border-dashed border-gray-300 w-full rounded-lg flex flex-col justify-center items-center hover:bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="gray"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                    <div className="font-poppins">
                      <span className="text-olive">Upload a file</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <div className="text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                )}
              </label>
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image[0]}</p>
            )}
          </div>

          <div className="options flex flex-row justify-between w-full">
            <div className="flex flex-col space-y-2 w-[24%]">
              <label htmlFor="prepTime" className="font-medium text-2xl">
                Prep Time (mins)
              </label>
              <input
                placeholder="e.g., 15"
                value={formData.prepTime}
                onChange={(e) => handleInputChange("prepTime", e.target.value)}
                className={`border ${
                  errors.prepTime ? "border-red-500" : "border-gray-300"
                } w-full rounded-md py-2 px-2 outline-none hover:border-olive`}
                type="number"
                id="prepTime"
                name="prepTime"
              />
              {errors.prepTime && (
                <p className="text-red-500 text-sm">{errors.prepTime[0]}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2 w-[24%]">
              <label htmlFor="cookTime" className="font-medium text-2xl">
                Cook Time (mins)
              </label>
              <input
                placeholder="e.g., 30"
                value={formData.cookTime}
                onChange={(e) => handleInputChange("cookTime", e.target.value)}
                className={`border ${
                  errors.cookTime ? "border-red-500" : "border-gray-300"
                } w-full rounded-md py-2 px-2 outline-none hover:border-olive`}
                type="number"
                id="cookTime"
                name="cookTime"
              />
              {errors.cookTime && (
                <p className="text-red-500 text-sm">{errors.cookTime[0]}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2 w-[24%]">
              <label htmlFor="servings" className="font-medium text-2xl">
                Serving
              </label>
              <input
                placeholder="e.g., 4"
                value={formData.servings}
                onChange={(e) => handleInputChange("servings", e.target.value)}
                className={`border ${
                  errors.servings ? "border-red-500" : "border-gray-300"
                } w-full rounded-md py-2 px-2 outline-none hover:border-olive`}
                type="number"
                id="servings"
                name="servings"
              />
              {errors.servings && (
                <p className="text-red-500 text-sm">{errors.servings[0]}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2 w-[24%]">
              <label htmlFor="spiciness" className="font-medium text-2xl">
                Spiciness (0-5)
              </label>
              <input
                id="spiciness"
                name="spiciness"
                type="number"
                min={0}
                max={5}
                value={formData.spiciness}
                onChange={(e) => handleInputChange("spiciness", e.target.value)}
                className={`border ${
                  errors.spiciness ? "border-red-500" : "border-gray-300"
                } w-full rounded-md py-2 px-2 outline-none hover:border-olive`}
              />
              {errors.spiciness && (
                <p className="text-red-500 text-sm">{errors.spiciness[0]}</p>
              )}
            </div>
          </div>

          <div className="flex flex-row w-full gap-6">
            <div className="w-1/2">
              <label className="font-medium text-2xl" htmlFor="difficulty">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
                className={`appearance-none border ${
                  errors.difficulty ? "border-red-500" : "border-gray-300"
                } w-full rounded-md py-2 px-2 outline-none hover:border-olive`}
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="text-red-500 text-sm">{errors.difficulty[0]}</p>
              )}
            </div>

            <div className="w-1/2">
              <label className="font-medium text-2xl" htmlFor="category">
                Category / Tag
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`appearance-none border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } w-full rounded-md py-2 px-2 outline-none hover:border-olive`}
              >
                <option value="">Select category</option>
                <option value="1">Soup / Stew</option>
                <option value="2">Rice Dish</option>
                <option value="3">Noodle Dish</option>
                <option value="4">Salad</option>
                <option value="5">Grilled / Fried Dish</option>
                <option value="6">Stir-fried / Sautéed Dish</option>
                <option value="7">Bakery / Pastry</option>
                <option value="8">Dessert / Sweet</option>
                <option value="9">Drink / Beverage</option>
                <option value="10">Sauce / Dip / Condiment</option>
                <option value="11">Vegetarian / Vegan Dish</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category[0]}</p>
              )}
            </div>
          </div>

          <div className="ingredients w-full">
            <div className="flex items-center justify-between">
              <div className="font-medium text-2xl flex items-center gap-3">
                <span>Ingredients</span>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="text-green-700 ml-2"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1/2">
                      <input
                        placeholder="Name"
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(index, "name", e.target.value)
                        }
                        className={`border ${
                          errors[`ingredients.${index}.name`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md py-2 px-2 w-full`}
                      />
                      {errors[`ingredients.${index}.name`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`ingredients.${index}.name`][0]}
                        </p>
                      )}
                    </div>
                    <div className="w-1/4">
                      <input
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        className={`border ${
                          errors[`ingredients.${index}.amount`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md py-2 px-2 w-full`}
                      />
                      {errors[`ingredients.${index}.amount`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`ingredients.${index}.amount`][0]}
                        </p>
                      )}
                    </div>
                    <div className="w-1/4">
                      <input
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, "unit", e.target.value)
                        }
                        className={`border ${
                          errors[`ingredients.${index}.unit`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md py-2 px-2 w-full`}
                      />
                      {errors[`ingredients.${index}.unit`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`ingredients.${index}.unit`][0]}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-600 bg-red-50 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errors.ingredients && typeof errors.ingredients === "string" && (
              <p className="text-red-500 text-sm mt-2">{errors.ingredients}</p>
            )}
            {errors.ingredients && Array.isArray(errors.ingredients) && (
              <p className="text-red-500 text-sm mt-2">
                {errors.ingredients[0]}
              </p>
            )}
          </div>

          <div className="steps w-full">
            <div className="flex items-center justify-between">
              <div className="font-medium text-2xl flex items-center gap-3">
                <span>Steps</span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="text-green-700 ml-2"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <textarea
                        placeholder={`Describe step ${index + 1}`}
                        value={step}
                        onChange={(e) =>
                          handleStepChange(index, e.target.value)
                        }
                        className={`border ${
                          errors[`steps.${index}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md py-2 px-2 w-full resize-none`}
                        rows={3}
                      />
                      {errors[`steps.${index}`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`steps.${index}`][0]}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-red-600 bg-red-50 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errors.steps && typeof errors.steps === "string" && (
              <p className="text-red-500 text-sm mt-2">{errors.steps}</p>
            )}
            {errors.steps && Array.isArray(errors.steps) && (
              <p className="text-red-500 text-sm mt-2">{errors.steps[0]}</p>
            )}
          </div>

          <div className="notes flex flex-col space-y-2 w-full">
            <label className="font-medium text-2xl" htmlFor="note">
              Additional Notes
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-olive resize-none"
              placeholder="Any special tips, ingredients, or serving suggestions..."
              rows="5"
            ></textarea>
          </div>

          <div className="button">
            <ButtonPrimary
              type="button"
              onClick={handleSubmit}
              className="w-40 sm:w-44 md:w-48 px-3 py-5 text-md sm:text-lg text-white font-semibold bg-primary transition-all duration-300 hover:bg-primary-hover hover:scale-105 hover:shadow-lg border border-none"
            >
              {isEdit ? "Update Recipe" : "Create Recipe"}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeForm;
