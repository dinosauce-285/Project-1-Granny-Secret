function Recipe({ image, title, savedDate, note}) {
    return (
        <div className="w-full h-56 bg-white rounded-xl overflow-hidden flex">
            <img className="w-[25%] h-full object-cover object-center" src={image} alt="" />

            <div className="main flex flex-1 flex-col px-5 py-5 justify-between">
                <div className="header w-full flex flex-row items-center justify-between">
                    <div className="title text-3xl font-medium font-inter">{title}</div>
                    <div className="w-1/5 flex flex-row justify-between text-gray-500">
                        <div className="font-poppins">Saved: {savedDate}</div>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </div>
                <div className="note font-inter font-light text-md italic">{note}</div>
            </div>
        </div>
    )
}
export default Recipe;