function Input({ placeholder, className }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`pl-4 border border-input-border mt-2 rounded-lg w-full h-12
                  outline-none focus:border-primary-hover
                  transition-all ease-in duration-100 
                  hover:scale-[1.01] focus:scale-[1.01]
                  appear-animation bg-input-bg ${className}`}
    />
  );
}

export default Input;