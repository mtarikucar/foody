import {useEffect, useState} from "react";

import Container from "../../Container";
import {FilterFood} from "../../../utils/filters";
import Filters from "../../Filters";
import {Title} from "..";
import {useStateValue} from "../../../context/StateProvider";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {getBranch, getCategories, getMenu} from "../../../api/axios";

import { TfiViewListAlt  ,TfiViewGrid} from "react-icons/tfi";


const Menu = ({title}: { title?: string }) => {
    const [{foodItems, menuData, categoriesData, branchData}, dispatch] =
        useStateValue();
    const {id} = useParams();
    const [menuId, setMenuId] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const [scrollValue, setScrollValue] = useState(0);
    const [filter, setFilter] = useState<string>("");
    const [colView, setColView] = useState(true); // State to toggle column view
    const {data: branch, isLoading: isBranchLoading, isError: isBranchError, error: branchError} = useQuery(
        ["branch", id],
        () => getBranch(id),
        {
            onSuccess: (branch) => {
                dispatch({
                    type: "SET_BRANCH",
                    branchData: branch.data,
                });
                setMenuId(branch.data.menuId);
                document.title = branch?.data?.branchName;
                //console.log(branch.data)
            },
            enabled: !!id,
        }
    );

    const {data: menu, isLoading: isMenuLoading, isError: isMenuError, error: menuError} = useQuery(
        ["menu", menuId],
        () => getMenu(menuId),
        {
            onSuccess: (menu) => {
                dispatch({
                    type: "SET_MENU",
                    menuData: menu.data,
                });
                // console.log(menu.data)
                /*          document.getElementById('dynamic-favicon').href = menu?.data?.logo;
                          document.documentElement.style.setProperty('--dynamic-color', menu?.data?.color);*/
            },

            enabled: !!menuId,
        }
    );

    const {data: categories, isLoading: isCategoryLoading, isError: isCategoryError, error: categoryError} = useQuery(
        ["category", menuId],
        () => getCategories(menuId),
        {
            onSuccess: (categories) => {
                dispatch({
                    type: "SET_CATEGORIES",
                    categoriesData: categories.data,
                });
                //console.log(categories.data)
            },
            enabled: !!menuId,
        }
    );

    if (isBranchLoading || isMenuLoading || isCategoryLoading) {
        return <h1>yükleniyor </h1>; // Yükleme ekranını göster
    }

    if (isBranchError || isMenuError || isCategoryError) {
        return <h1>hata </h1>; // Hata ekranını göster
    }

    return (
        <section className="w-full my-2" id="menu">
            <div className="w-full my-3 flex items-center justify-center">
                <Title title={title || "Our Hot Dishes"} center/>
            </div>
            <Filters filter={filter} setFilter={setFilter}/>
            <div className="flex justify-between items-center my-2 w-full px-4">
                <span>Ürünler</span>
                <button
                    className="p-2  text-gray-600  transition duration-300"
                    onClick={() => setColView(!colView)}
                    aria-label="Toggle View"
                >
                    {colView ? <TfiViewGrid size={24}/> : <TfiViewListAlt size={24}/>}
                </button>
            </div>
            <Container
                className=""
                col={colView}
                scrollOffset={scrollValue}
                filter={filter}
            />
        </section>
    );
};

export default Menu;
