function ButtonPrimary({children,className})
{
    return (
        <button className={`font-poppins   rounded-3xl text-black 
             transition duration-300 ease-in-out  ${className}`}>{children}</button>
    )
}
export default ButtonPrimary