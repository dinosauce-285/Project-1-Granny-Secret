import FilterButton from "./FilterButton";

function FilterSection() {
  const filters = [
    "Soup / Stew",
    "Rice Dish",
    "Noodle Dish",
    "Salad",
    "Grilled / Fried Dish",
    "Stir-fried / Sautéed Dish",
    "Bakery / Pastry",
    "Dessert / Sweet",
    "Drink / Beverage",
    "Sauce / Dip / Condiment",
    "Vegetarian / Vegan Dish"
  ];

  return (
    <div className="relative w-full sm:w-[95%] mx-auto">
      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-page to-transparent pointer-events-none z-10"></div>
      <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="flex flex-nowrap items-center space-x-2 sm:space-x-3 py-2 px-3 sm:px-0">
          {filters.map((item, index) => (
            <FilterButton key={index}>{item}</FilterButton>
          ))}
        </div>
      </div>
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-page to-transparent pointer-events-none z-10"></div>
    </div>
  );
}

export default FilterSection