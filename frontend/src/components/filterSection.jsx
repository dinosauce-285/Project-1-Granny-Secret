import FilterButton from "./filterButton";

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
    <div className="w-[95%] mx-auto overflow-x-auto overflow-y-hidden no-scrollbar">
      <div className="flex flex-nowrap items-center space-x-3 py-2">
        {filters.map((item, index) => (
          <FilterButton key={index}>{item}</FilterButton>
        ))}
      </div>
    </div>
  );
}

export default FilterSection