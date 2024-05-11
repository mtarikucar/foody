import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MainCarousel from "./MainCarousel.jsx";
import ProductsByCategory from "./ProductsByCategory.jsx";

function Home() {
    const menuData = useSelector((state) => state.global.menuData);
    return (
        <div className="w-full">

            <div className="">
                {
                    menuData?.banners &&  <MainCarousel/>
                }
                <ProductsByCategory/>
            </div>
            {/*<RightMenu isMenuActive={isMenuActive}/>*/}

        </div>
    );
}

export default Home;
