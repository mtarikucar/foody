/* eslint-disable */

import {HiX} from "react-icons/hi";
import Links from "./components/Links";

import routes from "../../routes.js";
import useOutsideClick from "../../hooks/useOutsideClick";
import {useRef} from "react";

const Sidebar = ({open, onClose}) => {
    const sidebarRef = useRef(); // Create a ref for the sidebar
    useOutsideClick(sidebarRef, onClose); // Use the hook to listen for outside clicks


    return (
        <div
            className={`drop-shadow-lg backdrop-blur-lg sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 ${
                open ? "translate-x-0" : "-translate-x-96"
            }`}
            ref={sidebarRef}
        >
      <span
          className="absolute top-4 right-4 block cursor-pointer"
          onClick={onClose}
      >
        <HiX/>
      </span>

            <div className={`mx-[56px] mt-[50px] flex items-center`}>
                <div
                    className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
                    Philo <span className="font-medium">Foodie</span>
                </div>
            </div>
            <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30"/>

            <ul className="mb-auto pt-1 content-joyride">
                <Links routes={routes} onClose={onClose}/>
            </ul>


            {/* Nav item end */}
        </div>
    );
};

export default Sidebar;
