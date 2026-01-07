function Input({ placeholder, className }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`pl-4 border border-[#d1cbb8] mt-2 rounded-lg w-full h-12
                  outline-none focus:border-[#007a00]
                  transition-all ease-in duration-100 
                  hover:scale-[1.01] focus:scale-[1.01]
                  appear-animation bg-[#fffdf7] ${className}`}
    />
  );
}

export default Input;