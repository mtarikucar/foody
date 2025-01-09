import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AddProduct from './components/AddProduct';
import ProductList from '../../../components/ProductList';
import ReadFromExcel from "./components/ReadFromExcel";
import React, {useState} from "react";
import Card from "../../../components/card";
import {useQuery} from "react-query";
import {BsPlusSquare, BsXSquare} from "react-icons/bs";
import useAuth from "../../../hooks/useAuth";
import AddCategory from "./components/AddCategory";
import Tooltip from "../../../components/tooltip";

const Products = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const [addCategory, setAddCategory] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const {data: categories} = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data;
    });

    return (
        <div className="mt-3 grid h-dvh grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className={"sticky col-span-2 lg:col-span-1"}>
                <Card extra={"rounded-md border border-gray-200 bg-white p-6 shadow-lg h-dvh overflow-y-scroll"}>
                    <div className={"flex justify-between items-center"}>
                        <h2 className={"text-lg font-bold text-navy-700 dark:text-white"}>Kategoriler</h2>
                        <Tooltip content={"Yeni kategori ekle"} placement={"bottom"} trigger={
                            <div onClick={() => setAddCategory(!addCategory)}
                                 className={"cursor-pointer bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 ml-2"}>
                                {!addCategory ? <BsPlusSquare className={"w-5 h-5"}/> :
                                    <BsXSquare className={"w-5 h-5"}/>}
                            </div>
                        }/>
                    </div>
                    {addCategory &&
                        <div className={"col-span-2"}>
                            <AddCategory/>
                        </div>}
                    <div className={"flex flex-col justify-center items-center w-full"}>
                        {categories?.data?.map((category, index) => (
                            <React.Fragment key={category.categoryId}>
                                <div
                                    className={`flex items-center justify-start w-full my-2 mx-3 p-4 cursor-pointer hover:bg-gray-200 ease-in-out duration-300 rounded-md ${selectedCategory === category.categoryId ? "bg-gray-200" : "bg-white"}`}
                                    onClick={() => setSelectedCategory(category.categoryId === selectedCategory ? "" : category.categoryId)}
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="h-16 w-16 rounded-xl drop-shadow-lg z-30 object-cover mr-3"
                                    />
                                    <span className={"text-base font-bold text-navy-700 dark:text-white"}>
                    {category.name}
                </span>
                                </div>
                                {index < categories.data.length - 1 &&
                                    <div className="w-full border-b border-gray-300"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </Card>
            </div>
            <div className={"col-span-2 max-h-dvh lg:overflow-y-scroll"}>
                <button
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4`}
                    onClick={() => setAddProduct(!addProduct)}
                >
                    Yeni Ürün Ekle
                </button>
                {addProduct && <div className={"mb-3"}>
                    <ReadFromExcel/>
                    <div className={"flex flex-row justify-center items-center w-full"}>
                        <hr className="my-8 mx-6 h-0.5 border-t-0 bg-indigo-500 opacity-100 dark:opacity-50 w-full"/>
                        <span>Veya</span>
                        <hr className="my-8 mx-6 h-0.5 border-t-0 bg-indigo-500 opacity-100 dark:opacity-50 w-full"/>
                    </div>
                    <AddProduct/>
                </div>}
                <ProductList categoryId={selectedCategory}/>
            </div>
        </div>
    );
};

export default Products;
