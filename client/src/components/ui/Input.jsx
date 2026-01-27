function Input({
  placeholder,
  className,
  type = "text",
  value,
  onChange,
  id,
  ...props
}) {
  return (
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
                  appear-animation bg-input-bg ${className}`}
      {...props}
    />
  );
}

export default Input;
