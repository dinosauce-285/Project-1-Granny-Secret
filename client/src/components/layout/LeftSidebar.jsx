import FilterButton from "../filters/FilterButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function LeftSidebar({ onFilterChange, activeFilter }) {
  const [categories, setCategories] = useState([]);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterClick = (filterKey) => {
    const newFilter = filterKey === activeFilter ? "all" : filterKey;

    if (onFilterChange) {
      if (newFilter === "all") {
        onFilterChange({ type: "all" });
      } else if (newFilter === "favourites") {
        onFilterChange({ type: "favourite" });
      } else if (newFilter === "my-recipes") {
        onFilterChange({ type: "my-recipes" });
      } else {
        onFilterChange({ type: "category", categoryId: newFilter });
      }
    }
  };

  return (
    <div className="hidden lg:block w-64 xl:w-72 h-full overflow-y-auto sticky top-0 pb-6 ">
      <div className="rounded-xl shadow-sm p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Profile</h3>
        <Link to={`/profile/${user?.id}`}>
          <FilterButton isActive={false} className="w-full justify-start">
            My Profile
          </FilterButton>
        </Link>

        <div className="border-t border-gray-200 my-4"></div>

        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Filters</h3>
        <div className="flex flex-col gap-2">
          <FilterButton
            isActive={activeFilter === "all"}
            onClick={() => handleFilterClick("all")}
            className="w-full justify-start"
          >
            All Recipes
          </FilterButton>

          <FilterButton
            isActive={activeFilter === "my-recipes"}
            onClick={() => handleFilterClick("my-recipes")}
            className="w-full justify-start"
          >
            My Recipes
          </FilterButton>

          <FilterButton
            isActive={activeFilter === "favourites"}
            onClick={() => handleFilterClick("favourites")}
            className="w-full justify-start"
          >
            Saved
          </FilterButton>
        </div>
      </div>

      <div className="rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <FilterButton
              key={cat.id}
              isActive={activeFilter === cat.id}
              onClick={() => handleFilterClick(cat.id)}
              className="w-full justify-start"
            >
              {cat.name}
            </FilterButton>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
