function FilterButton({
  children,
  isActive = false,
  onClick,
  icon,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`
        font-inter font-medium text-sm px-4 py-2.5 
        rounded-lg
        transition-all duration-200 ease-out
        text-left w-full
        flex items-center gap-2
        ${
          isActive
            ? "bg-primary text-white shadow-sm"
            : "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-primary"
        }
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export default FilterButton;
