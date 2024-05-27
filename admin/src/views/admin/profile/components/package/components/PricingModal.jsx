import React, {useEffect, useState} from 'react';
import PricingToggle from "./PricingToggle";
import {AnimatePresence, motion} from "framer-motion";
import PricingCard from "./PricingCard";
import Modal from "../../../../../../components/modal";
import {useMutation, useQuery} from "react-query";
import useAxiosPrivate from "../../../../../../hooks/useAxiosPrivate";
import {toast} from "react-toastify";


const PricingModal = ({packageModal, onClose}) => {

    const [isAnnual, setIsAnnual] = useState(false);
    const [plans, setPlans] = useState([])
    const axiosPrivate = useAxiosPrivate()

    const {
        data: packages,
        isLoading,
        isError,
        error
    } = useQuery(['packages'], async () => {
        const response = await axiosPrivate.get(`/package`);
        return response.data.data;
    }, {
        onSuccess: (data) => {
            setPlans(isAnnual ? data.filter(item => item.duration == "1 year") : data.filter(item => item.duration == "1 month"))
        }
    });

    useEffect(() => {
        setPlans(isAnnual ? packages?.filter(item => item.duration == "1 year") : packages?.filter(item => item.duration == "1 month"))
    }, [isAnnual]);


    return (<><Modal isOpen={packageModal} onClose={onClose} size={"extraLarge"}
                     title={"ucretlendirme"} description={"denem surumu, aylik ve yillik ucretlendirme"}>
        {/*<PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual}/>*/}
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
