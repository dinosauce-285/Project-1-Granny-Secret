import { useState, useRef, useEffect } from "react";
import FilterButton from "./FilterButton";
import api from "../../api/api";

function FilterSection() {
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const categories = res.data.data.map((cat) => cat.name);
        setFilters(["All", ...categories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [filters]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  return (
    <div className="relative w-full sm:w-[95%] mx-auto py-2">
      <div
        className={`hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-page to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
          showLeftGradient ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto overflow-y-hidden no-scrollbar"
      >
        <div className="flex flex-nowrap items-center gap-2 sm:gap-3 py-3 px-3 sm:px-2">
          {filters.map((item, index) => (
            <FilterButton
              key={index}
              isActive={
                activeFilter === item || (item === "All" && !activeFilter)
              }
              onClick={() => handleFilterClick(item === "All" ? null : item)}
            >
              {item}
            </FilterButton>
          ))}
        </div>
      </div>
      <div
        className={`hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-page to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
          showRightGradient ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
}

export default FilterSection;
