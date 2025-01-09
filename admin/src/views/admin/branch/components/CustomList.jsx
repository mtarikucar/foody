import React, {useState} from "react";
import Card from "../../../../components/card";
import {Button} from "@chakra-ui/button";
import UpdateProduct from "../../products/components/UpdateProduct";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {axiosPrivate} from "../../../../api/axios";
import useAuth from "../../../../hooks/useAuth";


// Pastel renk paleti
const colors = [
    "#FFB6C1", // Light Pink
    "#FFD700", // Gold
    "#98FB98", // Pale Green
    "#87CEEB", // Sky Blue
    "#FFA07A", // Light Salmon
    "#DA70D6", // Orchid
    "#FFC0CB", // Pink
    "#D8BFD8", // Thistle
    "#ADD8E6", // Light Blue
];

const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

const CustomList = ({datas, menuId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState();
    const auth = useAuth();

    const toggleProductModal = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = (data) => {
        setIsOpen(true);
        setSelected(data);
    };

    const {data: features, isSuccess} = useQuery('features', async () => {
        try {
            const response = await axiosPrivate.get(`/product/features?companyId=${auth.companyId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    });

    const getFeatureNames = (featureIds) => {
        if (!isSuccess || !features) return [];
        return features.data.filter(feature => featureIds.includes(feature.featureId));
    };

    return (
        <Card extra={"mt-3 overflow-hidden"}>
            {/* Ürün güncelleme modalı */}
            <UpdateProduct
                isOpen={isOpen}
                onClose={toggleProductModal}
                productData={selected}
                menuId={menuId}
            />

            {datas &&
                datas.filter((item) => item != null).map((data, index) => (
                    <div
                        key={index}
                        onClick={() => handleSubmit(data)}
                        className="grid grid-cols-12 gap-4 p-4 mt-3 bg-white shadow-lg rounded-lg hover:bg-gray-100 cursor-pointer dark:bg-navy-800 dark:hover:bg-navy-700"
                    >
                        {/* Ürün Resimleri */}
                        <div className="col-span-3 flex items-center justify-start">
                            <div className="relative flex items-center justify-center w-16 h-16">
                                {data?.images?.slice(0, 3).map((image, i) => (
                                    <img
                                        key={i}
                                        className={`absolute rounded-lg object-cover w-16 h-16 transform translate-x-${i * 2}`}
                                        src={image}
                                        alt={data?.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="col-span-5 flex flex-col justify-center">
                            <h5 className="text-base font-bold text-navy-700 dark:text-white">
                                {data?.name}
                            </h5>
                            <p className="text-sm font-normal text-gray-600">
                                Kategori: {data?.categoryId}
                            </p>
                        </div>

                        {/* Ürün Özellikleri */}
                        <div className="col-span-2 flex flex-wrap items-center gap-2">
                            {getFeatureNames(data.featureIds).map((feature) => (
                                <div
                                    key={feature?.featureId}
                                    style={{ backgroundColor: getRandomColor() }} // Rastgele renk atanıyor
                                    className="p-2 text-sm font-bold text-center text-white rounded-md"
                                >
                                    {feature?.featureName}
                                </div>
                            ))}
                        </div>

                        {/* Fiyat ve Değerlendirme */}
                        <div className="col-span-2 flex flex-col justify-center">
                            <div className="text-sm font-bold text-navy-700 dark:text-white">
                                {data?.price} Tl
                            </div>
                            <div className="text-sm font-normal text-gray-600 dark:text-white">
                                ⭐ ({data?.ratings})
                            </div>
                        </div>
                    </div>
                ))}
        </Card>
    );
};

export default CustomList;
