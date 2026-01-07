import { MainLayout, ButtonPrimary } from "../../components"
function CreateRecipe() {
    return (
        <div>
            <MainLayout>
                <div className=" w-[95%] shadow-2xl font-inter mx-auto bg-white rounded-2xl py-4 px-4 flex flex-col space-y-10 justify-between items-start border border-dashed border-gray-300">
                    <div className="title font-bold text-4xl">Create New Recipe</div>
                    <div className="recipeName w-full space-y-2" >
                        <lable for="name" className="font-medium text-2xl">Recipe Title</lable>
                        <input id="name" className="py-2 px-2 w-full border border-gray-300 outline-none rounded-md hover:border-[#6B8E23] transition-all duration-300" type="text" placeholder="e.g., Delicious Spaghetti Bolognese" />
                    </div>
                    <div className="image w-full space-y-2">
                        <lable for="image" className="font-medium text-2xl">Recipe Image</lable>
                        <div id="image" className="py-6 text-sm border border-dashed border-gray-300 w-full rounded-lg flex flex-col justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="gray" class="size-12">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <div className="font-poppins">
                                <span className="text-[#6B8E23]">Upload a file</span>
                                <span className="text-gray-500"> or drag and drop</span>
                            </div>
                            <div className="text-gray-500">PNG, JPG, GIF up to 10MB</div>
                        </div>
                    </div>
                    <div className="options flex flex-row justify-between  w-full">
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label for="time" className="font-medium text-2xl">Prep Time</label>
                            <input placeholder="e.g., 15 " className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23]" type="number" id="time" />
                        </div>
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label for="time" className="font-medium text-2xl">Cook Time</label>
                            <input placeholder="e.g., 30" className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23]" type="number" id="time" />
                        </div>
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label for="time" className="font-medium text-2xl">Serving</label>
                            <input placeholder="e.g., 4" className="border border-gray-300  w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23]" type="number" id="time" />
                        </div>
                        <div className="flex flex-col space-y-2 w-[24%]">
                            <label for="time" className="font-medium text-2xl">Spicy Level</label>
                            <select className=" appearance-none border border-gray-300  w-full rounded-md py-2 px-2  outline-none hover:border-[#6B8E23]" id="time">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className="category flex flex-col space-y-2 w-full">
                        <label className="font-medium text-2xl" for="cate">Category / Tag</label>
                        <select id="cate" className="appearance-none border border-gray-300  w-full rounded-md py-2 px-2  outline-none hover:border-[#6B8E23]">
                            <option>Soup / Stew</option>
                            <option>Rice Dish</option>
                            <option>Noodle Dish</option>
                            <option>Salad</option>
                            <option>Grilled / Fried Dish</option>
                            <option>Stir-fried / Sautéed Dish</option>
                            <option>Bakery / Pastry</option>
                            <option>Dessert / Sweet</option>
                            <option>Drink / Beverage</option>
                            <option>Sauce / Dip / Condiment</option>
                            <option>Vegetarian / Vegan Dish</option>
                        </select>

                    </div>
                    <div className="notes flex flex-col space-y-2 w-full">
                        <label className="font-medium text-2xl" for="note">Additional Notes</label>
                        <textarea id="note"
                            className="border border-gray-300 w-full rounded-md py-2 px-2 outline-none hover:border-[#6B8E23] resize-none"
                            placeholder="Any special tips, ingredients, or serving suggestions..."
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="button" >
                        <ButtonPrimary className="w-40 sm:w-44 md:w-48 px-3 py-5 text-md sm:text-lg text-white  font-semibold bg- transition-all bg-[#006400]  duration-300 hover:bg-[#007a00] hover:scale-105 hover:shadow-lg border border-none">Create Recipe</ButtonPrimary>
                    </div>
                </div>
            </MainLayout>
        </div>
    )
}
export default CreateRecipe