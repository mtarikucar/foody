import React, { useState, useEffect } from "react";
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import Card from "../../../../../components/card";
import PricingModal from "./components/PricingModal";
import { useQuery } from "react-query";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../../hooks/useAuth";

const Package = () => {
    const [progress, setProgress] = useState(0);
    const [packageModal, setPackageModal] = useState(false);
    const auth = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const today = new Date();

            const totalDuration = end.getTime() - start.getTime();
            const elapsed = today.getTime() - start.getTime();
            const progressPercentage = (elapsed / totalDuration) * 100;

            setProgress(progressPercentage);
        }
    }, [startDate, endDate]);

    const isCriticalPeriod = progress > 90;

    const {
        data: packageData,
        isLoading,
        isError,
        error
    } = useQuery(['subscription'], async () => {
            const response = await axiosPrivate.get(`package/subscription`, {
                params: {
                    companyId: auth.companyId
                }
            });
            return response.data.data;
        }, {
            onSuccess: (data) => {
                setStartDate(data?.purchaseDate);
                setEndDate(data?.expireDate);
            }
        }
    );

    return (
        <>
            <PricingModal packageModal={packageModal} onClose={() => setPackageModal(false)} />
            <Card extra={"w-full h-full p-3"}>
                {/* Subscription Status */}
                <div className="mb-auto flex flex-col items-center justify-center h-full">
                    <div
                        className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[26px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
                        {packageData?.packageId ? <BsEmojiLaughing /> : <BsEmojiExpressionless />}
                    </div>
                    <h4 className="mb-px mt-3 text-md font-bold text-navy-700 dark:text-white">
                        {packageData?.packageId ? `Paketinin bitmesine kalan gün: ${Math.floor((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24) + 1)}` :
                            <div className={"flex flex-col justify-center items-center gap-2"}>
                               Bir plan seçin
                                <div onClick={() => setPackageModal(true)}
                                     className={"rounded-md p-2  hover:bg-indigo-700 bg-indigo-500 hover:-translate-y-2 text-white ease-in-out duration-300 cursor-pointer"}>
                                    Paket Satın Al
                                </div>
                            </div>}
                    </h4>
                </div>
                {packageData?.packageId &&
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-600">Start: {new Date(startDate).toLocaleDateString()}</p>
                            <p className="text-sm font-medium text-gray-600">End: {new Date(endDate).toLocaleDateString()}</p>
                        </div>
                        <div
                            className="mt-2 flex h-3 w-full rounded-full bg-gray-200 dark:bg-navy-700">
                            <div
                                className={`h-full rounded-full ${
                                    isCriticalPeriod
                                        ? "bg-red-500 dark:bg-red-400"
                                        : "bg-brand-500 dark:bg-brand-400"
                                }`}
                                style={{ width: `${progress}%` }}
                            >
                            </div>
                        </div>
                    </div>
                }
            </Card>

        </>
    );
};

export default Package;
