import React from 'react';
import { motion } from 'framer-motion';
import {useMutation, useQueryClient} from "react-query";
import {toast} from "react-toastify";
import useAxiosPrivate from "../../../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../../../hooks/useAuth";

const PricingCard = ({packageId, duration, price, featureList }) => {

    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const auth = useAuth()

    const getSub = useMutation(logo => {
        return axiosPrivate.post(`/package/subscription`, {packageId: packageId, companyId: auth.companyId});
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("subscription")
            toast("abonelik olusturuldu")
        }
    });


    return (
        <motion.div
            className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white hover:-translate-y-2 cursor-pointer hover:drop-shadow-2xl ease-in-out duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="px-6 py-4">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="font-bold  mb-2 text-4xl">{duration}</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-gray-700 text-2xl">
                        {price}
                    </p>
                </motion.div>
            </div>
            <div className="px-6 pt-4 pb-2">
                {featureList?.map((feature, index) => (
                    <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {feature}
                    </span>
                ))}
            </div>
            <div className={"p-4 flex justify-center items-center bg-indigo-500 rounded-lg border-2 hover:-translate-y-1 text-white ease-in-out duration-300"}
            onClick={()=>getSub.mutate()}>
                satin al
            </div>
        </motion.div>
    );
};

export default PricingCard;
