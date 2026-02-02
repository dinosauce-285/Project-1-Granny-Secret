function Input({
  label,
  placeholder,
  className,
  type = "text",
  value,
  onChange,
  id,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-4 border border-input-border rounded-lg w-full h-12
                  outline-none focus:border-primary-hover
                  transition-all ease-in duration-100 
                  hover:scale-[1.01] focus:scale-[1.01]
                  appear-animation ${className}`}
        {...props}
      />
    </div>
  );
}

export default Input;
