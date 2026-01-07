function SearchBar() {
    return (
        <div className="searchBar w-full sm:w-auto mx-auto rounded-2xl group">
            <div className="flex items-center border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white  focus-within:shadow-[0_4px_6px_-1px_rgba(107,142,35,0.1),_0_2px_4px_-1px_rgba(107,142,35,0.06)] group-hover:-translate-y-0.5">
                <button className="searchIcon px-3 sm:px-4 flex-shrink-0 py3- flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth="1.5" stroke="gray" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    className="transition-all duration-300 rounded-2xl flex-1 min-w-0 xs:w-44 sm:w-64 md:w-96 lg:w-[500px] xl:w-[600px] px-2 py-2 bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm sm:text-base"
                />
            </div>
        </div>
    );
}

export default SearchBar;