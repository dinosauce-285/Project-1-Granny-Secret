function ShowTag({ url, children, description}) {
    return (
        <div 
         className="card relative h-[100%] w-[20%] bg-[#fafafa] border border-2 border-white flex justify-center items-start overflow-visible">
            <div className="absolute -top-16 w-[80%] flex justify-center flex-col text-center font-semibold font-inter text-xl">
                <img style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }} src={url} alt="food" className="rounded-full shadow-lg mb-4" />
                {children} 
                <div className="mt-5 font-light text-[#9ca3af] ">
                    {description}
                </div>
            </div>
        </div>
    );
}
export default ShowTag
