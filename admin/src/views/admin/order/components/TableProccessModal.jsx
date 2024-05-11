import React, {useState} from 'react';
import Modal from "../../../../components/modal";
import Card from "../../../../components/card";
import PaymentModal from "./PaymentModal";
import QuickPaymentModal from "./QuickPaymentModal";
import CancelModal from "./CancelModal";
import PrintModal from "./PrintModal";

const NewOrderModal = ({isOpen, onClose}) => {

    const [paymentModal, setPaymentModal] = useState(false);
    const [quickPaymentModal, setQuickPaymentModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [printModal, setPrintModal] = useState(false);


    return (
        <>
            <PaymentModal isOpen={paymentModal} onClose={() => setPaymentModal(!paymentModal)} />
            <QuickPaymentModal isOpen={quickPaymentModal} onClose={() => setQuickPaymentModal(!quickPaymentModal)}/>
            <CancelModal isOpen={cancelModal} onClose={() => setCancelModal(!cancelModal)}/>
            <PrintModal isOpen={printModal} onClose={() => setPrintModal(!printModal)}/>

            <Modal isOpen={isOpen} onClose={onClose} size={"large"}
                   title={"masa islemleri"} className="rounded-lg shadow-lg">
                <div className={"grid sm:grid-cols-3 grid-cols-2 gap-5"}>
                    <Card
                        extra={`flex w-full justify-center items-center text-xl font-bold text-navy-700 cursor-pointer dark:text-white min-h-[4rem] border-2 !border-none size-24`}>
                        <div className={"size-24"} onClick={() => {
                            setPaymentModal(true)
                            onClose()
                        }}>
                            ode
                        </div>
                    </Card>
                    <Card
                        extra={`flex w-full justify-center items-center text-xl font-bold text-navy-700 cursor-pointer dark:text-white min-h-[4rem] border-2 !border-none size-24`}>
                        <div className={"size-24"} onClick={() => {
                            setQuickPaymentModal(true)
                            onClose()
                        }}>
                            hizli ode
                        </div>
                    </Card>
                    <Card
                        extra={`flex w-full justify-center items-center text-xl font-bold text-navy-700 cursor-pointer dark:text-white min-h-[4rem] border-2 !border-none size-24`}>
                        <div className={"size-24"} onClick={() => {
                            setCancelModal(true)
                            onClose()
                        }}>
                            iptal
                        </div>
                    </Card>
                    <Card
                        extra={`flex w-full justify-center items-center text-xl font-bold text-navy-700 cursor-pointer dark:text-white min-h-[4rem] border-2 !border-none size-24`}>
                        <div className={"size-24"} onClick={() => {
                            setPrintModal(true)
                            onClose()
                        }}>
                            yazdir
                        </div>
                    </Card>


                </div>

            </Modal>
        </>
    );
};

export default NewOrderModal;
