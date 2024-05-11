import {useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import Header from "../components/Header.jsx";
import ScrollToTop from "../../hooks/ScrollToTop.jsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch, useSelector} from "react-redux";
import {useQuery} from "react-query";
import {getBranch, getCategories, getMenu} from "../../api/axios.js";
import {setGlobalData} from "../../store/actions.js";
import LandingPage from "../../pages/LandingPage.jsx";
import ErrorPage from "../../pages/ErrorPage.jsx";
import ScrollBack from "../../components/ScrollBack.jsx";

export default function Default() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const [menuId, setMenuId] = useState(null);
    const [showButton, setShowButton] = useState(false);

    const {data: branch, isLoading: isBranchLoading, isError: isBranchError, error: branchError} = useQuery(
        ["branch", id],
        () => getBranch(id),
        {
            onSuccess: (branch) => {
                dispatch(setGlobalData({branchData: branch.data}));
                setMenuId(branch.data.menuId);
                document.title = branch?.data?.branchName;
            },
            enabled: !!id,
        }
    );

    const {data: menu, isLoading: isMenuLoading, isError: isMenuError, error: menuError} = useQuery(
        ["menu", menuId],
        () => getMenu(menuId),
        {
            onSuccess: (menu) => {
                dispatch(setGlobalData({menuData: menu.data}));
                document.getElementById('dynamic-favicon').href = menu?.data?.logo;
                document.documentElement.style.setProperty('--dynamic-color', menu?.data?.color);
            },
            enabled: !!menuId,
        }
    );

    const {data: categories, isLoading: isCategoryLoading, isError: isCategoryError, error: categoryError} = useQuery(
        ["category", menuId],
        () => getCategories(menuId),
        {
            onSuccess: (categories) => {
                dispatch(setGlobalData({categoryData: categories.data}));
            },
            enabled: !!menuId,
        }
    );

    if (isBranchLoading || isMenuLoading || isCategoryLoading) {
        return <LandingPage/>; // Yükleme ekranını göster
    }

    if (isBranchError || isMenuError || isCategoryError) {
        const errorMessage = branchError?.message || menuError?.message || categoryError?.message;
        return <ErrorPage message={errorMessage}/>; // Hata ekranını göster
    }

    return (
        <div className="flex h-full w-full sm:container">
            <ScrollBack/>
            <ScrollToTop/>
            <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 sm:container">
                <div className={``}>
                    <div className="h-full">
                        <Header/>
                        <div className=" mx-auto mb-auto h-full min-h-[84vh]  md:pr-2">
                            <Outlet/>

                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    );
}
