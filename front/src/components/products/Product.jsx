import {AddRounded, Favorite, StarRounded} from "@mui/icons-material";
import React, {useState} from "react";
import {FaHeart, FaPlusCircle, FaStar} from 'react-icons/fa';
import {MdMore} from "react-icons/md";
import ProductModal from "./ProductModal.jsx";
import {Link} from "react-router-dom";
import {useQuery} from "react-query";
import {getBranch, getFeatures} from "../../api/axios.js";
import {setGlobalData} from "../../store/actions.js";
import {CgDetailsMore} from "react-icons/all.js";

let cartData = [];

function Product({productId, images, name, price, ratings, description}) {
    const [isFavorite, setFavorite] = useState(false);
    const [rating, setRating] = useState(4);
    const [showModal, setShowModal] = useState(false);
    const tailwindColors = [
        'bg-red-500',    // Kırmızı
        'bg-blue-500',   // Mavi
        'bg-green-500',  // Yeşil
        'bg-yellow-500', // Sarı
        'bg-purple-500', // Mor
        'bg-pink-500',   // Pembe
        'bg-indigo-500', // İndigo
        'bg-teal-500',   // Teal
        'bg-gray-500'    // Gri
    ];

    const {
        data: features, isLoading: isBranchLoading, isError: isBranchError, error: branchError
    } = useQuery(["features"], () => getFeatures(productId), {});

    const renderStars = () => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={`cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(i + 1)}
                />
            );
        }
        return stars;
    };

    return (
        <>
            <div className="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
                <div className=" bg-cover bg-landscape max-h-[140px]">
                    <img src={images} alt=""/>
                </div>
                <div className="flex flex-col justify-center w-2/3 px-1  py-2">
                    <h1 className="text-xl font-bold text-gray-900">
                        {name}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {description} lorem kasjcnıebv erhfbawıbufIW wehfbawefWEYB
                    </p>

                    <div className="flex justify-between mt-3 item-center">
                        <h1 className="text-xl font-bold text-gray-700">
                            ₺{price}.00
                        </h1>
                        <button onClick={()=> setShowModal(true)} className="text-3xl">
                            <CgDetailsMore className={"text-dynamic"}/>
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <ProductModal
                    id={productId}
                    imgSrc={images}
                    name={name}
                    ratings={ratings}
                    price={price}
                    description={description}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </>
    );
}

export default Product;

/*
<div className="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
                <div className=" bg-cover bg-landscape">
                    <img src={images} alt="" />
                </div>
                <div className="flex flex-col justify-center w-2/3 px-4 py-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Tomorow
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        You can&#x27;t buy your future,
                    </p>

                    <div className="flex justify-between mt-3 item-center">
                        <h1 className="text-xl font-bold text-gray-700">
                            $220
                        </h1>
                        <button className="text-3xl">
                           <CgDetailsMore/>
                        </button>
                    </div>
                </div>
            </div>
* */