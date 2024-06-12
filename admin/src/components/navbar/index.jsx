// Navbar.js
import React, { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import avatar from "../../assets/img/avatars/avatar4.png";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../store/AuthSlice";
import useAuth from "../../hooks/useAuth";

import Notifications from "./Notifications";
import Briefs from "./Briefs";


const Navbar = (props) => {
    const { onOpenSidenav, brandText } = props;
    const [darkmode, setDarkmode] = useState(false);

    const dispatch = useDispatch();
    const auth = useAuth();


    return (
        <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2  dark:bg-[#0b14374d]">
            <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
                {/* Profile & Dropdown */}
                <span
                    className="flex cursor-pointer text-xl text-gray-600 dark:text-white ml-3"
                    onClick={onOpenSidenav}
                >
                    <FiAlignJustify className="h-5 w-5" />
                </span>

                <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3 pr-2 text-xl">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    />
                </div>

                <Notifications />
                <Briefs/>

                <Dropdown
                    button={
                        <img
                            className="h-10 w-10 rounded-full"
                            src={auth.companyLogo || avatar}
                            alt="Elon Musk"
                        />
                    }
                    children={
                        <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:absolute sm:left-0 sm:translate-x-0 translate-x-[-100%]">
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        👋 Hoşgeldinizz
                                    </p>
                                </div>
                            </div>
                            <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

                            <div className="flex flex-col p-4">
                                <Link
                                    to={"/admin/profile"}
                                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                                >
                                    Profil
                                </Link>
                                <a
                                    href=" "
                                    className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                                    onClick={() => dispatch(logoutSuccess())}
                                >
                                    çıkış yap
                                </a>
                            </div>
                        </div>
                    }
                    classNames={"py-2 top-8 w-max"}
                />
            </div>
            <div className="ml-[6px]">
                <div className="h-6 w-[224px] pt-1">
                    <a
                        className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                        href=" "
                    >
                        Sayfalar
                        <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
                            /
                        </span>
                    </a>
                    <Link
                        className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                        to="#"
                    >
                        {brandText}
                    </Link>
                </div>
                <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
                    <Link
                        to="#"
                        className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
                    >
                        {brandText}
                    </Link>
                </p>
            </div>
        </nav>
    );
};

export default Navbar;
