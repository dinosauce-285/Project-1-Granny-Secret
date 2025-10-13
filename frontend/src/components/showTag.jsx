import React from 'react';

function ShowTag({ url, children, description, className }) {
    return (
        <div className={`relative ${className}`}>
            <div className="flex justify-center">
                <img
                    style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }}
                    src={url}
                    alt={children}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 
                    object-cover rounded-full shadow-lg 
                    transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 
                    relative z-10" />
            </div>
            
            <div className="group card bg-[#fafafa] border-2 border-white 
                flex flex-col justify-start items-center 
                px-3 sm:px-4 md:px-5
                pt-12 sm:pt-14 md:pt-16 lg:pt-20
                pb-4 sm:pb-5 md:pb-6
                -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16
                h-48 sm:h-52 md:h-56 lg:h-64
                rounded-lg shadow-lg 
                transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                
                <h3 className="font-semibold font-inter 
                    text-sm sm:text-base md:text-lg lg:text-xl 
                    text-center mb-2 leading-tight 
                    line-clamp-2">
                    {children}
                </h3>
                <p className="font-light text-[#9ca3af] 
                    text-xs sm:text-sm md:text-base 
                    text-center leading-relaxed 
                    line-clamp-3 sm:line-clamp-4">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default ShowTag;