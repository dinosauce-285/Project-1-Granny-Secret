import React from 'react';

function ShowTag({ url, children, description, className }) {
    return (
        <div
            className={`card relative bg-[#fafafa] border border-2 border-white flex flex-col justify-start items-center p-4 rounded-lg shadow-lg ${className}`}>

            <img
                style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }}
                src={url}
                alt={children}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full shadow-lg -mt-14 sm:-mt-20 mb-3 sm:mb-4" />

            <h3 className="font-semibold font-inter text-base sm:text-lg md:text-xl text-center mb-1 sm:mb-2 leading-tight">
                {children}
            </h3>
            <p className="mt-2 font-light text-[#9ca3af] text-xs sm:text-sm md:text-base text-center leading-snug">
                {description}
            </p>
        </div>
    );
}

export default ShowTag;