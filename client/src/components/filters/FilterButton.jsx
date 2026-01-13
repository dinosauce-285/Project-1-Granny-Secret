function FilterButton({ children, isActive = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        font-inter font-medium text-sm px-5 py-2.5 
        rounded-full whitespace-nowrap
        transition-all duration-300 ease-out
        border
        ${
          isActive
            ? "bg-primary text-white border-primary"
            : "bg-white text-gray-700 border-gray-200 hover:bg-olive/10 hover:text-olive hover:border-olive/30"
        }
      `}
    >
      {children}
    </button>
  );
}

export default FilterButton;
