function SearchBar() {
    return (
        <div className="searchBar mx-auto">
            <div className="flex items-center border-2 border-gray-100 rounded-full focus-within:border-gray-300 transition-all duration-200 bg-white">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    className="w-96 md:w-[500px] lg:w-[600px] px-5 py-2 rounded-l-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                />
                <button className="searchIcon bg-gray-100 py-2Z px-4 flex items-center justify-center rounded-r-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>


        </div>
    )
}
export default SearchBar