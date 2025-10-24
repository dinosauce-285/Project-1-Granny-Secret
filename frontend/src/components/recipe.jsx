function Recipe({ image, title, savedDate, prep, cook, servings, difficulty, tag, color, note }) {
    return (
        <div className="w-full h-56 bg-white rounded-xl overflow-hidden flex shadow-md my-8 hover:-translate-y-1 hover:shadow-xl transition-transform duration-300 group">
            <img className="w-[25%] h-full object-cover object-center" src={image} alt="" />

            <div className="main flex flex-1 flex-col px-5 py-5 justify-between">
                <div className="header w-full flex flex-row items-center justify-between">
                    <div className="title text-3xl font-medium font-inter">{title}</div>
                    <div className="w-1/5 flex flex-row justify-between text-gray-500">
                        <div className="font-poppins">Saved: {savedDate}</div>
                        <button className="group-hover:scale-125 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>

                        </button>
                    </div>
                </div>
                <div className="info flex flex-row justify-between font-poppins text-sm w-[80%]">
                    <div className="flex flex-row justify-between items-center">
                        <svg className="w-[1.5em] h-[1.5em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <div className="ml-2">Prep: {prep}m | Cook: {cook}</div>

                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <svg className="w-[1.5em] h-[1.5em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <div className="ml-2">{servings}</div>


                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <svg className="w-[1.5em] h-[1.5em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                        </svg>
                        <div className="ml-2">{difficulty}</div>

                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <svg className="w-[1.5em] h-[1.5em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>

                        <div className="ml-2">{tag}</div>

                    </div>
                </div>
                <div className="note font-inter font-light text-md italic">{note}</div>
            </div>
            <div style={{ backgroundColor: color }} className="h-full w-[3%]" ></div>
        </div>
    )
}
export default Recipe;