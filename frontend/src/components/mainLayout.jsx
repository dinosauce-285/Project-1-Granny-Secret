import { Link } from "react-router-dom"
import SearchBar from "./searchBar"
import sampleAva from "../assets/sampleAva.jpg"

function MainLayout({ children }) {
    return (
        <div className="fixed inset-0 flex flex-row pt-2 overflow-hidden">
            <div className="navBar w-[5%] h-full ml-3 flex flex-col items-center">
                <Link to="/dashboard">
                    <div className="logoWrapper h-[8vh] flex items-center justify-center">
                        <img src="logo.webp" alt="" className="h-[100%]" />
                    </div>
                </Link>

                <div className="icons mt-auto mb-auto flex flex-col space-y-8">
                    <div className="hover:bg-[#6B8E2350] hover:scale-110 p-2 rounded-md">
                        <svg className="w-8 h-8 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    </div>
                    
                    <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
            </div>

            <div className="mainContent ml-3 mr-8 flex-1 min-w-0 flex flex-col overflow-hidden">
                <div className="header w-full mb-4 h-[8vh] flex flex-row items-center flex-shrink-0">
                    <SearchBar />
                    <div className="flex flex-row items-center gap-8">
                        <div className="w-10 h-10 flex rounded-lg items-center justify-center hover:bg-white transition-all duration-300`">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </div>



                        <div className="avatar border border-white border-[2px] shadow-xl hover:border-[#6B8E23] hover:border-[2.5px] transition-all duration-300  w-10 h-10 rounded-full overflow-hidden">
                            <img src={sampleAva} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
export default MainLayout