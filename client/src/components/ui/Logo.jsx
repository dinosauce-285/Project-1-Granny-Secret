function Logo({ className, children }) {
    return (
        <div className={`logo h-[100%] flex flex-row justify-center items-center transition-transform duration-300 hover:scale-110 ${className}`}>
            <img src="./logo.webp" alt="" className="h-[80%] object-contain " />
            {children}
        </div>
    )
}
export default Logo