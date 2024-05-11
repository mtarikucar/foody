// PricingToggle.js
import React from 'react';

const PricingToggle = ({ isAnnual, setIsAnnual }) => {
    return (
        <div className="flex items-center justify-center my-4 ">
            <span className="text-sm mr-3">Aylik</span>
            <div className="relative">
                <input
                    id="toggle"
                    type="checkbox"
                    className="sr-only"
                    checked={isAnnual}
                    onChange={(e) => setIsAnnual(e.target.checked)} // onClick yerine onChange kullanın
                />
                <label
                    htmlFor="toggle"
                    className={`block ${isAnnual ? "bg-amber-400" : "bg-indigo-500"} w-14 h-8 rounded-full cursor-pointer`}
                ></label>
                <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                        isAnnual ? 'transform translate-x-6 ' : ''
                    }`}
                ></div>
            </div>
            <span className="text-sm ml-3">yillik</span>
        </div>
    );
};

export default PricingToggle;
