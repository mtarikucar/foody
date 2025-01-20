import React, {useState} from "react";
import Dropdown from "../dropdown";
import {FiAlignJustify} from "react-icons/fi";
import {Link, useNavigate} from "react-router-dom";
import avatar from "../../assets/img/avatars/avatar4.png";
import {useDispatch} from "react-redux";
import {logoutSuccess, setBranch} from "../../store/AuthSlice";
import useAuth from "../../hooks/useAuth";
import {useQuery} from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {FaArrowRight, FaExchangeAlt, FaHome} from "react-icons/fa";
import Spinner from "../../components/Spinner/Spinner";
import Notifications from "./Notifications";
import Briefs from "./Briefs";

const Navbar = (props) => {
    const {onOpenSidenav, brandText} = props;

    const dispatch = useDispatch();
    const auth = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const {data: branches, isLoading, error} = useQuery("branches", async () => {
        const response = await axiosPrivate.get(`/branch?companyId=${auth.companyId}`);
        return response.data;
    });

    const [selectedBranch, setSelectedBranch] = useState(auth.branchId);

    const handleBranchChange = (branch) => {
        dispatch(setBranch({branchId: branch.branchId, menuId: branch.menuId}));
        setSelectedBranch(branch.branchId);
    };

    return (<nav
        className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 dark:bg-[#0b14374d]">
        <div
            className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[500px] md:flex-grow-0 md:gap-1 xl:w-[600px] xl:gap-2">
            {/* Toggle Sidebar */}
            <span
                className="flex cursor-pointer text-xl text-gray-600 dark:text-white ml-3"
                onClick={onOpenSidenav}
            >
                    <FiAlignJustify className="h-5 w-5"/>
                </span>
            {auth.currentUserRole === "ADMIN" && (<span
                    className="flex cursor-pointer text-xl text-gray-600 dark:text-white ml-3"
                    onClick={() => navigate("/admin/profile")}
                >
                     <FaHome className="h-5 w-5"/>
                 </span>

            )}


            {/* Selected Branch Info */}
            <div
                className="flex h-full items-center justify-between bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white px-4 py-2 rounded-lg w-full xl:w-[300px]">
                {isLoading ? (<Spinner size={20}/>) : error ? (
                    <p className="text-sm text-red-500">Şubeler yüklenemedi.</p>) : (<>
                    <div className="flex flex-col">
                         <span className="text-sm font-bold">
                                         {branches?.data.find((branch) => branch.branchId === selectedBranch)?.branchName || "Şube Seç"}
                         </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                               {branches?.data.find((branch) => branch.branchId === selectedBranch)?.address || ""}
                        </span>
                    </div>
                    <Dropdown
                        button={<FaExchangeAlt
                            className="text-indigo-500 hover:text-indigo-700 w-5 h-5 cursor-pointer"/>}
                        children={<div className="w-64 bg-white shadow-md rounded-lg p-2 dark:bg-navy-700">
                            {branches?.data.map((branch) => (<div
                                key={branch.branchId}
                                onClick={() => handleBranchChange(branch)}
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            >
                        <span className="text-sm font-medium">
                          {branch.branchName}
                        </span>
                                <FaArrowRight className="w-4 h-4 text-gray-500"/>
                            </div>))}
                        </div>}
                        classNames="py-2 top-8 w-max"
                    />
                </>)}
            </div>

            {/* Notifications */}
            <Notifications/>

            {/* Briefs */}
            <Briefs/>

            {/* Profile Dropdown */}
            <Dropdown
                button={<img
                    className="h-10 w-10 rounded-full"
                    src={auth.companyLogo || avatar}
                    alt="Avatar"
                />}
                children={<div
                    className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                    <div className="p-4">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                                👋 Hoşgeldiniz
                            </p>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gray-200 dark:bg-white/20"/>
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
                            Çıkış Yap
                        </a>
                    </div>
                </div>}
                classNames="py-2 top-8 w-max"
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
    </nav>);
};

export default Navbar;
