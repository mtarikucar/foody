import CustomCard from "../../../components/card/CustomCard";
import {useMutation, useQuery, useQueryClient} from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useParams} from "react-router-dom";
import Card from "../../../components/card";
import ProductModal from "./components/ProductModal";
import React, {useState} from "react";
import Notification from "../profile/components/Notification";
import ColorPickerComponent from "../../../components/ColorPickerComponent";
import {toast} from "react-toastify";
import CustomList from "../branch/components/CustomList";
import Settings from "./components/Settings";
import ProductList from "../../../components/ProductList";
import BannerController from "./components/BannerController";


const Menu = () => {

    const axiosPrivate = useAxiosPrivate()
    const {id} = useParams()
    const queryClient = useQueryClient()
    const [color, setColor] = useState("#fff")
    const handleChangeColor = (newColor) => {
        setColor(newColor);
    };


    const fetchMenuData = async ({id}) => {
        try {
            const response = await axiosPrivate.get(`/menu/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Menü verileri yüklenirken bir hata oluştu: ", error);
            throw error;
        }
    };

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const toggleProductModal = () => {
        setIsProductModalOpen(!isProductModalOpen);
    };

    // Mutation for updating the menu color
    const updateMenuColor = useMutation(newColor => {
        return axiosPrivate.put(`/menu/${id}`, {color: newColor});
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("menuData")
            toast("menu rengi degistirlidi")
        }
    });

    // Function to handle the color update
    const handleUpdateColor = () => {
        updateMenuColor.mutate(color);
    };


    const {data: menu, isLoading: isLoadingMenu, error: errorMenu} = useQuery(
        ['menuData', {id: id}],
        () => fetchMenuData({id: id}), {
            onSuccess: (data) => {
                setColor(data.color)
            }
        }
    );

    return (
        <div className="flex w-full flex-col gap-5">
            <ProductModal isOpen={isProductModalOpen} onClose={toggleProductModal}/>
            <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
                <div className="col-span-12 lg:col-span-4 lg:!mb-0">
                    {menu && <CustomCard
                        title={menu.menuName}
                        author={id}
                        price={id}
                    >
                        <>
                            <ColorPickerComponent
                                color={color || "#123"}
                                setColor={setColor}
                            />
                            {menu.color !== color && (


                                <button onClick={handleUpdateColor}
                                        className={`w-full p-2 text-white  bg-indigo-500  hover:p-4 ease-in-out duration-300`}>
                                    yeni rengi onayla
                                </button>

                            )}
                        </>
                    </CustomCard>
                    }
                </div>
                <div className="col-span-12 lg:col-span-8 lg:mb-0 ">
                    {menu &&
                        <BannerController menu={menu}/>
                    }
                </div>
                {/*<div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
                    <Settings/>
                </div>*/}


                <div className={"w-full border-b-2 border-gray-300 col-span-12" }/>
                <div className={"my-3 flex justify-center items-center col-span-12"}>

                    <h2 className={"font-bold text-2xl"}>ÜRÜNLER</h2>
                </div>
                <div className={'col-span-12'}>

                    <Card extra={`flex flex-col w-full h-fit !p-4 3xl:p-![18px] bg-white overflow`}
                          onClick={toggleProductModal}>
                        <div
                            className=" w-full flex flex-col items-center justify-center hover:cursor-pointer">
                            <div className="flex flex-col items-center justify-center group">
                                <svg
                                    className="justify-center mb-3 h-12 w-12 group-hover:w-16 group-hover:h-16 ease-in-out duration-300"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="gray">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"/>
                                </svg>
                                <span>menuyu yeni urunler ekle</span>
                            </div>
                        </div>
                    </Card>
                    <ProductList axiosPrivate={axiosPrivate} menuId={id}/>
                </div>


            </div>
        </div>
    )
        ;
};

export default Menu;


