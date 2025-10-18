import { Link } from "react-router-dom"
import SearchBar from "./searchBar"
import sampleAva from "../assets/sampleAva.jpg"

function MainLayout({ children }) {
    return (
        <div className="fixed inset-0 flex flex-row pt-2 overflow-hidden">
            <div className="navBar w-[5%] h-full ml-3 flex flex-col items-center">
                <Link to="/dashboard">
                    <div className="logoWrapper h-[8vh] flex items-center justify-center">
                        <img src="logo.webp" alt="" className="h-[80%]" />
                    </div>
                </Link>

                <div className="icons mt-auto mb-auto flex flex-col space-y-8">
                    <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
            </div>
            
            <div className="mainContent ml-3 mr-8 flex-1 min-w-0 flex flex-col overflow-hidden">
                <div className="header w-full h-[8vh] flex flex-row items-center flex-shrink-0">
                    <SearchBar/>
                    <div className="avatar  w-10 h-10 rounded-full overflow-hidden">
                        <img src={sampleAva} alt="" className="w-full h-full object-cover" />
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