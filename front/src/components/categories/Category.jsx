import {useEffect, useState} from "react";
import {ChevronRightRounded} from "@mui/icons-material";

function Category({image, name, categoryId, filter, setFilter}) {


    return (

        <div
            onClick={() => setFilter(filter === categoryId ?  '':categoryId)}
            className={
                filter === categoryId ? "active rowMenuCard" : "rowMenuCard border border-dynamic shadow-xl"}>
            <div className="imgBox">
                <img src={image} alt=""/>
            </div>
            <h3 className="text-xl over">{name}</h3>
            <i
                className={
                    filter === categoryId
                        ? "loadMenu  transform rotate-90 "
                        : "loadMenu"
                }
            >
                <ChevronRightRounded className="text-lg"/>
            </i>
        </div>

    );
}

export default Category;
