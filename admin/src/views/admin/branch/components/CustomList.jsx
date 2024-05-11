import React, {useState} from "react";

import Card from "../../../../components/card";
import {Button} from "@chakra-ui/button";
import UpdateProduct from "../../products/components/UpdateProduct";
import DeleteProduct from "../../products/components/DeleteProduct";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
import {useMutation, useQueryClient} from "react-query";
import {toast} from "react-toastify";
import DeleteProductFromMenu from "../../menus/components/DeleteProductFromMenu";

const CustomList = ({datas, menuId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState();


    const toggleProductModal = () => {
        setIsOpen(!isOpen);
    };



    const handleSubmit = (data) => {
        setIsOpen(true)
        setSelected(data)
    };



    return (
        <Card extra={"mt-3 !z-5 overflow-hidden"}>
            <UpdateProduct isOpen={isOpen} onClose={toggleProductModal} productData={selected}  menuId={menuId}/>
            <div className="flex items-center justify-between rounded-md p-3">
                <div className="text-lg font-bold text-navy-700 dark:text-white">
                    Ürünler
                </div>

            </div>

            {datas && datas?.filter(item => item != null).map((data, index) => (
                <div
                    key={index}
                    onClick={() => handleSubmit(data)}
                    className={`flex h-full w-full items-start justify-between bg-white px-3 py-[20px] hover:shadow-2xl dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700 hover:bg-gray-200 cursor-pointer rounded-md`}>
                    <div className="flex sm:flex-row flex-col  items-center gap-3">
                        <div className="flex h-16 w-16 items-start sm:relative">
                            {
                                data?.images?.slice(0, 3).map((image, i) =>
                                    <img
                                        key={i}
                                        className={`h-full w-full rounded-xl sm:absolute drop-shadow-lg z-30 translate-x-${i * 3} object-cover`}
                                        src={image}
                                        alt=""
                                    />
                                )
                            }

                        </div>

                        <div className="flex flex-col translate-x-6">
                            <h5 className="text-base font-bold text-navy-700 dark:text-white">
                                {" "}
                                {data?.name}
                            </h5>
                            <p className="mt-1 text-sm font-normal text-gray-600">
                                {" "}
                                {data?.categoryId}{" "}
                            </p>
                        </div>
                    </div>

                    <div className="mt-1 flex items-center space-x-8 justify-center text-navy-700 dark:text-white">

                        <div className="ml-1 flex items-center text-sm font-bold text-navy-700 dark:text-white">
                            <p> {} </p>
                            {data?.price} <p className="ml-1">Tl</p>
                        </div>
                        <div className="ml-2 flex items-center text-sm font-normal text-gray-600 dark:text-white">
                            <p>{data?.ratings}</p>
                            <p className="ml-1">rate</p>
                        </div>




                    </div>

                </div>
            ))}
        </Card>
    );
};

export default CustomList;
