function Logo({className}) {
    return (
        <div className={`logo h-[100%] flex flex-row justify-center items-center ${className}`}>
            <img src="./logo.png" alt="" className="h-[80%] object-contain " />
            <div style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }} className="font-poppins font-semibold ml-5">Granny's Secret</div>
        </div>
    )
}
export default Logo