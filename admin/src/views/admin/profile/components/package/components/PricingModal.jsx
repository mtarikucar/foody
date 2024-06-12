import React from 'react';
import {AnimatePresence, motion} from "framer-motion";
import PricingCard from "./PricingCard";
import Modal from "../../../../../../components/modal";
import {useMutation, useQuery} from "react-query";
import useAxiosPrivate from "../../../../../../hooks/useAxiosPrivate";


const PricingModal = ({packageModal, onClose}) => {
    const axiosPrivate = useAxiosPrivate()

    const {
        data: plans,
        isLoading,
        isError,
        error
    } = useQuery(['packages'], async () => {
        const response = await axiosPrivate.get(`/package`);
        return response.data.data;
    }, {
        onSuccess: (data) => {
            console.log(data)
        }
    });




    return (<>
        <Modal isOpen={packageModal} onClose={onClose} size={"extraLarge"}
                     title={"ucretlendirme"} description={"denem surumu, aylik ve yillik ucretlendirme"}>
            {
            (plans?.length == 0 || plans == null) ?
                <div className={"font-semibold flex justify-center items-center"}>
                    sabit ücretlendirme paketler henüz eklenmemiştir detaylı bilgi ve fiyat için ilteişm kısında bize
                    ulaşabilrisiniz teşekkürler
                </div>
                :
                <AnimatePresence>

                    <div className="grid md:grid-cols-3 -mx-4">
                        {plans?.map((plan, index) => (<div key={index} className="w-full px-4 mb-6">

                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                transition={{duration: 0.2}}
                            >
                                <PricingCard {...plan} />
                            </motion.div>
                        </div>))}
                    </div>

                </AnimatePresence>
        }
    </Modal></>);
};

export default PricingModal;
