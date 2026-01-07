import { MainLayout, ButtonPrimary } from "../../components"

function CreateRecipe() {
    return (
        <div>
            <MainLayout>
                <div className=" w-[95%] shadow-2xl font-inter mx-auto bg-white rounded-2xl py-4 px-4 flex flex-col space-y-10 justify-between items-start border border-dashed border-gray-300">
                    <div className="title font-bold text-4xl">Create New Recipe</div>

                    <div className="recipeName w-full space-y-2" >
                        <label htmlFor="title" className="font-medium text-2xl">Recipe Title</label>
                        <input id="title" name="title" className="py-2 px-2 w-full border border-gray-300 outline-none rounded-md hover:border-[#6B8E23] transition-all duration-300" type="text" placeholder="e.g., Delicious Spaghetti Bolognese" />
                    </div>

                    <div className="image w-full space-y-2">
                        <label htmlFor="image" className="font-medium text-2xl">Recipe Image</label>
                        <div className="py-2">
                            {/* Hidden file input: clicking the dashed area will open file chooser */}
                            <input id="image" name="image" type="file" accept="image/*" className="hidden" />
                            <label htmlFor="image" className="block mt-1 cursor-pointer" aria-label="Upload image">
                                <div className="py-6 text-sm border border-dashed border-gray-300 w-full rounded-lg flex flex-col justify-center items-center hover:bg-gray-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="gray" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <div className="font-poppins">
                                        <span className="text-[#6B8E23]">Upload a file</span>
                                        <span className="text-gray-500"> or drag and drop</span>
                                    </div>
                                    <div className="text-gray-500">PNG, JPG, GIF up to 10MB</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="options flex flex-row justify-between  w-full">
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label htmlFor="prepTime" className="font-medium text-2xl">Prep Time (mins)</label>
                            <input placeholder="e.g., 15 " className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23]" type="number" id="prepTime" name="prepTime" />
                        </div>
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label htmlFor="cookTime" className="font-medium text-2xl">Cook Time (mins)</label>
                            <input placeholder="e.g., 30" className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23]" type="number" id="cookTime" name="cookTime" />
                        </div>
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label htmlFor="servings" className="font-medium text-2xl">Serving</label>
                            <input placeholder="e.g., 4" className="border border-gray-300  w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23]" type="number" id="servings" name="servings" />
                        </div>
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label htmlFor="spiciness" className="font-medium text-2xl">Spiciness (0-5)</label>
                            <input id="spiciness" name="spiciness" type="number" min={0} max={5} className="border border-gray-300  w-full rounded-md py-2 px-2  outline-none hover:border-[#6B8E23]" />
                        </div>
                    </div>

                    <div className="flex flex-row w-full gap-6">
                        <div className="w-1/2">
                            <label className="font-medium text-2xl" htmlFor="difficulty">Difficulty</label>
                            <select id="difficulty" name="difficulty" className="appearance-none border border-gray-300  w-full rounded-md py-2 px-2  outline-none hover:border-[#6B8E23]">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="font-medium text-2xl" htmlFor="category">Category / Tag</label>
                            <select id="category" name="category" className="appearance-none border border-gray-300  w-full rounded-md py-2 px-2  outline-none hover:border-[#6B8E23]">
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
                        </div>
                    </div>

                    <div className="ingredients w-full">
                        <div className="flex items-center justify-between">
                            <div className="font-medium text-2xl flex items-center gap-3">
                                <span>Ingredients</span>
                                <button type="button" className="text-green-700 ml-2">+</button>
                            </div>
                        </div>
                        <div className="mt-3 space-y-3" data-ingredients="">
                            <div className="flex items-center gap-3">
                                <input placeholder="Name" name="ingredientName" className="border border-gray-300 rounded-md py-2 px-2 w-1/2" />
                                <input placeholder="Amount" name="ingredientAmount" className="border border-gray-300 rounded-md py-2 px-2 w-1/4" />
                                <input placeholder="Unit" name="ingredientUnit" className="border border-gray-300 rounded-md py-2 px-2 w-1/4" />
                                <button type="button" aria-label="Remove ingredient" className="text-red-600 bg-red-50 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center">−</button>
                            </div>
                        </div>
                    </div>

                    <div className="steps w-full">
                        <div className="flex items-center justify-between">
                            <div className="font-medium text-2xl flex items-center gap-3">
                                <span>Steps</span>
                                <button type="button" className="text-green-700 ml-2">+</button>
                            </div>
                        </div>
                        <div className="mt-3 space-y-4" data-steps="">
                            <div className="flex flex-col">
                                <div className="flex items-start gap-3">
                                    <textarea placeholder="Describe this step" name="stepContent" className="border border-gray-300 rounded-md py-2 px-2 flex-1 resize-none" rows={3} />
                                    <button type="button" aria-label="Remove step" className="text-red-600 bg-red-50 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center">−</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="notes flex flex-col space-y-2 w-full">
                        <label className="font-medium text-2xl" htmlFor="note">Additional Notes</label>
                        <textarea id="note" name="note"
                            className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23] resize-none"
                            placeholder="Any special tips, ingredients, or serving suggestions..."
                            rows="5"
                        ></textarea>
                    </div>

                    <div className="button" >
                        <ButtonPrimary type="button" className="w-40 sm:w-44 md:w-48 px-3 py-5 text-md sm:text-lg text-white  font-semibold bg- transition-all bg-[#006400]  duration-300 hover:bg-[#007a00] hover:scale-105 hover:shadow-lg border border-none">Create Recipe</ButtonPrimary>
                    </div>
                </div>
            </MainLayout>
        </div>
    )
}
export default CreateRecipe