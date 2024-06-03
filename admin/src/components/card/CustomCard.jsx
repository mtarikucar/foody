import {useState} from "react";
import Card from "./index";

const CustomCard = ({
                        isSelected,
                        title,
                        author,
                        price,
                        ratings,
                        image,
                        createTime,
                        bidders,
                        extra,
                        showButton = true,
                        children,
                        color
                    }) => {
    const [heart, setHeart] = useState(true);
    const cardClass = isSelected ? 'border-blue-500' : 'border-2';
    const menuColor = color ? `bg-[${color}]` : "bg-white";

    return (
        <Card
            extra={`flex flex-col w-full border-2 h-full !p-4 3xl:p-![18px] ${menuColor} ${cardClass} ${extra} ease-in-out duration-200`}
        >
            <div className={`grid ${image ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-4 h-full w-full`}>
                <div className={`${image ? 'col-span-2' : 'col-span-1'} relative flex flex-col justify-center`}>
                    <button
                        onClick={() => setHeart(!heart)}
                        className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer"
                    >
                        {/* Heart icon can be added here */}
                    </button>

                    <div className="mb-2 flex flex-col items-start justify-between px-1">
                        <div className="mb-1">
                            <p className="text-lg font-bold text-navy-700 dark:text-white">
                                {title}
                            </p>
                            {author && (
                                <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
                                    Oluşturan: {author}
                                </p>
                            )}
                        </div>
                    </div>
                    {
                        ratings && (
                            <div className="flex flex-col items-start justify-between">
                                <div className="flex">
                                    <p className="mb-2 text-sm font-bold text-gray-600 dark:text-white">
                                        Ürün Değerlendirmesi: {ratings}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    {
                        price && (
                            <div className="flex flex-col items-start justify-between">
                                <div className="flex">
                                    <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
                                        Ürün Fiyatı: {price}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    {
                        createTime && (
                            <div className="flex flex-col items-start justify-between">
                                <div className="flex">
                                    <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
                                        Tarih: {createTime}
                                    </p>
                                </div>
                            </div>
                        )
                    }

                </div>

                {image && (
                    <div className="col-span-1 flex items-center justify-center">
                        <img src={image} alt={title} className="h-full object-cover rounded-lg"/>
                    </div>
                )}
            </div>
            {children}
        </Card>
    );
};

export default CustomCard;
