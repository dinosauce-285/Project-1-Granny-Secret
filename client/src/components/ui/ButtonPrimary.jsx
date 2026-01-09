function ButtonPrimary({
  children,
  className,
  onClick,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-poppins rounded-3xl text-black transition duration-300 ease-in-out ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
export default ButtonPrimary;
