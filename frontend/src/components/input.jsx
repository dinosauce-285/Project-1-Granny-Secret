function Input({ placeholder, className }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`pl-4 border border-gray-300 mt-2 rounded-lg w-full h-12
                  focus:border-[#9ca3af] focus:shadow-md focus:shadow-gray-200 
                  focus:outline-none transition-all ease-in duration-100 ${className}`}
    />
  );
}

export default Input;
