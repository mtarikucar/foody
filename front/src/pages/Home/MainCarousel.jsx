import React from "react";
import {Carousel} from 'flowbite-react';
import {useSelector} from "react-redux";

function MainCarousel() {
    const menuData = useSelector((state) => state.global.menuData);

    return (
        <div className="h-48 sm:h-64 xl:h-80 2xl:h-96 ">


            <Carousel >
                {
                    menuData && menuData?.banners?.map((banner, key) => (
                        <img className="rounded-none" src={banner} key={key} alt="..."/>
                    ))
                }
            </Carousel>
        </div>
    );
}

export default MainCarousel;
