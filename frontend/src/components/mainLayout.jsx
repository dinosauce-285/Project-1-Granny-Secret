import sampleAva from "../assets/sampleAva.jpg"
function MainLayout({children}) {
    return (
        <div className="flex flex-row h-full pt-2">
            <div className="navBar w-[5%] h-full ml-3 flex flex-col items-center ">
                <div className="logoWrapper h-[10vh] flex items-center justify-center">
                    <img src="logo.webp" alt="" className="h-[60%]"/>
                </div>
                
                <div className="icons mt-auto mb-auto flex flex-col space-y-8">
                    <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </div>
            </div>
            <div className="mainContent ml-3 mr-8 flex-1 min-w-0">
                <div className="header w-full h-[10vh] flex flex-row items-center ">
                    <div className="searchBar mx-auto">
                        <div className="flex items-center border-2 border-gray-200 rounded-full focus-within:border-gray-400 transition-all duration-200 bg-white">
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                className="w-96 md:w-[500px] lg:w-[600px] px-5 py-3 rounded-l-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                            />
                            <div className="searchIcon bg-gray-100 py-3 px-4 flex items-center justify-center rounded-r-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                        </div>


                    </div>
                    <div className="avatar rounded-full overflow-hidden">
                        <img src={sampleAva} alt="" className="w-10 h-10" />
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}
export default MainLayout