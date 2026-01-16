function FilterButton({ children, isActive = false, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        font-inter font-medium text-sm px-4 py-2.5 
        rounded-lg
        transition-all duration-200 ease-out
        text-left w-full
        ${
          isActive
            ? "bg-olive text-white shadow-sm"
            : "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-olive"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default FilterButton;
