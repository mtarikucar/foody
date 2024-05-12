import React from "react";
import {Feature, Product} from "../../../types";
import {useQuery} from "react-query";
import {getFeatures} from "../../api/axios";

type ProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    item: Product;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, item }) => {
    const tailwindColors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
        'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-gray-500'
    ];

    const { data: features, isLoading, isError, error } = useQuery(["features", item.productId],
        () => getFeatures(item.productId),
        { enabled: isOpen } // Ensure the query only runs when the modal is open
    );

    if (!isOpen) return null;
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error....</div>;

    return (
        <>
            <div className="fixed inset-0 z-50 p-3 flex items-center justify-center overflow-auto">
                <div className="relative w-auto max-w-3xl mx-auto">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                        <div className="flex justify-center">
                            <div className="block w-full rounded-lg shadow-lg bg-white">
                                <img className="rounded-t-lg w-full" src={item.images[0]} alt={item.name} />
                                <div className="p-6">
                                    <div className='flex justify-between items-center mb-4'>
                                        <h5 className="text-xl font-medium text-neutral-800">{item.name}</h5>
                                        <p className="text-xl text-neutral-800">₺{item.price}.00</p>
                                    </div>
                                    <p className="text-base text-neutral-600 mb-4">
                                        {item.description}
                                    </p>
                                    <div className='flex flex-wrap gap-3'>
                                        {features?.data?.map((feature: Feature, index: number) => {
                                            const colorClass = tailwindColors[index % tailwindColors.length];
                                            return (
                                                <span key={index} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium ${colorClass} text-white`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span>
                                                    {feature.featureName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="mt-4 py-2 w-full bg-blue-500 text-white rounded uppercase font-bold text-sm transition duration-150 ease-linear hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 m-4 cursor-pointer" onClick={onClose}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ProductModal;