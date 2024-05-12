import React, {useState} from 'react';
import { TbListDetails } from 'react-icons/tb';
import {Product} from "../../../types";
import ProductModal from "../Modals/ProductModal";  // Ensure this import if it's not already included

type SingleProductProps = {
    item: Product;
    col?: boolean;
    admin?: boolean;
};

export const SingleProduct = ({
                                  item,
                                  col = false,
                                  admin = false
                              }: SingleProductProps) => {
    const { productId, name, price, images, description } = item;
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!isModalOpen);
    const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/500';
    const productClassName = `bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl ${
        col ? 'flex-row' : 'flex-col'
    } flex w-full`;
    const imageClass = `flex-none rounded-l-xl object-cover ${col ? 'w-1/3 h-auto' : 'w-full h-40'}`;
    const contentClass = `flex flex-col justify-between p-4 flex-grow`;

    return (
        <>
        <div className={productClassName}>
            <img
                src={imageUrl}
                alt={name}
                className={imageClass}
            />
            <div className={contentClass}>
                <div>
                    <p className="text-lg font-bold text-black truncate">{name}</p>
                    <p className="text-md text-gray-700">{description}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-semibold text-black">${price}</p>
                   <TbListDetails onClick={()=> setModalOpen(true)} className="text-2xl cursor-pointer" />
                </div>
            </div>
        </div>
            <ProductModal  isOpen={isModalOpen} onClose={toggleModal} item={item}/>
        </>
    );
};