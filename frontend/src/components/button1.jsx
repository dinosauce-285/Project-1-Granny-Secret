function Button1({children,className})
{
    return (
        <button className={`font-poppins border border-black px-2 py-3 rounded-3xl text-black 
            hover:bg-black hover:text-white transition duration-300 ease-in-out  ${className}`}>{children}</button>
    )
}
export default Button1