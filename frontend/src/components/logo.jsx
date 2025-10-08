function Logo({className}) {
    return (
        <div className={`logo h-[100%] flex flex-row justify-center items-center ${className}`}>
            <img src="./logo.png" alt="" className="h-[100%] object-contain" />
            <h3 style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }} className="font-poppins font-semibold">Granny's Secret</h3>
        </div>
    )
}
export default Logo