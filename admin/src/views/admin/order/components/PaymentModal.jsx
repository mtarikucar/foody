import React, {useEffect, useState} from 'react';
import Modal from "../../../../components/modal";
import {useQuery, useQueryClient} from "react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
import {IoCashOutline, IoCardOutline, IoRemoveCircleOutline, IoAddCircleOutline, IoTrashOutline} from "react-icons/io5";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import { useSocket } from 'context/socket/useWebSocket';


const PaymentModal = ({isOpen, onClose, tableId}) => {
    // Existing state and hooks
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const [enteredAmount, setEnteredAmount] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const {socket} = useSocket();
    const user = useSelector((state) => state.auth);
    const navigate = useNavigate();
    // Load orders and calculate total cost
    const {data: orders} = useQuery(['additionOrder'], async () => {
        const response = await axiosPrivate.get(`/orders?branchId=${auth?.branchId}&status=1&tableId=${tableId}`);
        return response.data.data;
    }, {
        onSuccess: (data) => {
            if (data.length === 0) {
                /*onClose();*/
            }
        },

        refetchOnMount: true, refetchOnWindowFocus: true, refetchOnReconnect: true,


    });

    useEffect(() => {
        queryClient.invalidateQueries(['additionOrder']);
        if (orders) {
            const total = orders.reduce((acc, order) => acc + order.totalAmount, 0);
            const paymentTotal = paymentHistory.reduce((acc, payment) => acc + payment.amount, 0);
            setTotalCost(total - paymentTotal);
        }
    }, [orders, isOpen, paymentHistory, queryClient, tableId]);


    const submitPayment = async () => {
        try {
            if (!socket.connected) {

                await reconnectWebSocket();
            }
            const orderIds = orders.map(order => order.orderId); // Assuming each order has an ID
            const amount = paymentHistory.reduce((acc, payment) => acc + payment.amount, 0);
            const payload = {
                tableId: tableId,
                amount: amount,
                cash: paymentHistory.find(payment => payment.type === 'cash')?.amount || null,
                card: paymentHistory.find(payment => payment.type === 'card')?.amount || null,
                other: paymentHistory.find(payment => payment.type === 'other')?.amount || null,
                orderIds: orderIds,
                branchId: user?.branchId,
            };

            socket.send("/app/addition/" + auth.branchId + "/" + tableId, {}, JSON.stringify(payload));
            socket.send("/app/notification/" + auth.currentUser, {}, JSON.stringify({
                content: "ödeme tamalanmıştır.", userId: auth.currentUser, createTimestamp: new Date().getTime()
            }));
            toast("ödeme tamamlandı");
            setPaymentSuccess(true);
            setPaymentHistory([]);
            setTotalCost(0);
            setEnteredAmount('');
            onClose();
            queryClient.invalidateQueries(['additionOrder']);
            queryClient.invalidateQueries(['tableOrder']);
            navigate('/admin/order');
        } catch (error) {
            console.error('Payment submission failed:', error);
            toast('Ödeme başarısız oldu');
        }
    };

    const reconnectWebSocket = async () => {
        try {
            await socket.disconnect();
            await socket.connect();
            console.log('WebSocket connection reestablished');
        } catch (error) {
            console.error('WebSocket reconnection failed:', error);
        }
    };
    const handleNumberClick = (number) => {
        setEnteredAmount(enteredAmount + number.toString());
    };

    const handleDeleteClick = () => {
        setEnteredAmount(enteredAmount.slice(0, -1));
    };

    // Updated addPayment function
    const addPayment = (type) => {
        let amount = parseFloat(enteredAmount);
        if (!amount || amount > totalCost) {
            if (totalCost > 0) amount = totalCost; else {
                toast("Geçersiz tutar. Lütfen toplam maliyeti aşmayan geçerli bir tutar girin.");
                return;
            }
        }

        const index = paymentHistory.findIndex(payment => payment.type === type);
        if (index !== -1) {
            const newPaymentHistory = [...paymentHistory];
            newPaymentHistory[index].amount += amount;
            setPaymentHistory(newPaymentHistory);
        } else {
            setPaymentHistory([...paymentHistory, {type, amount}]);
        }
        setEnteredAmount('');
        setTotalCost(prev => prev - amount);
    };

    const closePaymentModal = () => {
        if (paymentHistory.length > 0) {
            if (!paymentSuccess) {
                toast.error('Ödemeyi tamamlayınız.');
                return;
            }
        } else {
            onClose();
        }

    }

    const changePayment = (type, process) => {
        const index = paymentHistory.findIndex(payment => payment.type === type);
        if (index !== -1) {
            const newPaymentHistory = [...paymentHistory];
            if (process === "delete") {
                newPaymentHistory.splice(index, 1)
                setTotalCost(totalCost + paymentHistory[index].amount)
            } else {
                if (process === "increase") {
                    if (totalCost > 0) {
                        newPaymentHistory[index].amount += 1;
                        setTotalCost(totalCost - 1)
                    } else {
                        toast("maliyeti aşamazsın")
                    }
                } else if (process === "reduce") {
                    if (newPaymentHistory[index].amount > 0) {
                        newPaymentHistory[index].amount -= 1;
                        setTotalCost(totalCost + 1)
                    }
                }
            }
            setPaymentHistory(newPaymentHistory);
        }
    }


    return (<Modal
            isOpen={isOpen}
            onClose={() => closePaymentModal()}
            size={"extraLarge"}
            title={"Sipariş İşlemleri"}
            className="rounded-lg shadow-lg relative"
        >
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-wrap -mx-3">
                    {/* Left panel for order list */}
                    <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
                        <div className="p-6 border rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold mb-4">Parçalı Öde</h3>
                            {orders && orders.length > 0 ? (<div className="divide-y divide-gray-200">
                                {orders.map((order, index) => (<div key={index} className="py-4">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    >
                                        <h3 className="text-lg font-semibold">
                                            {new Date(order.createTime).toLocaleDateString()}
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            Toplam Tutar: {order.totalAmount}₺
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Durum: {order.status === 1 ? 'Aktif' : 'Pasif'}
                                        </div>
                                    </div>
                                    {openIndex === index && (<div className="mt-4">
                                        <span className="font-medium">Sipariş Detayı:</span>
                                        <ul className="list-disc pl-5">
                                            {order.orderDetails.map((detail, detailIndex) => (
                                                <li key={detailIndex}>
                                                    {detail.product.name} (Adet: {detail.quantity})
                                                </li>))}
                                        </ul>
                                    </div>)}
                                </div>))}
                            </div>) : (<div className="text-center text-gray-500">Sipariş bulunmamaktadır.</div>)}
                        </div>
                    </div>

                    {/* Center panel for numeric keypad */}
                    <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
                        <div className="p-6 border rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold mb-4">Ödeme Tutarı</h3>
                            <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg mb-4">
                                    <span
                                        className="text-2xl font-medium">₺{enteredAmount !== '' ? enteredAmount : totalCost}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (<button
                                    key={number}
                                    className="py-3 px-4 bg-gray-200 rounded-lg text-xl font-medium hover:bg-gray-300 transition duration-300"
                                    onClick={() => handleNumberClick(number)}
                                >
                                    {number}
                                </button>))}
                                <button
                                    className="py-3 px-4 col-span-2 bg-gray-200 rounded-lg text-xl font-medium hover:bg-gray-300 transition duration-300"
                                    onClick={() => handleNumberClick(0)}
                                >
                                    0
                                </button>
                                <button
                                    className="py-3 px-4 bg-gray-200 rounded-lg text-xl font-medium hover:bg-gray-300 transition duration-300"
                                    onClick={() => handleDeleteClick()}
                                >
                                    ⌫
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right panel for payment options and history */}
                    <div className="w-full lg:w-1/3 px-3">
                        <div className="p-6 border rounded-lg shadow-md bg-white">
                            <div className="mb-5">
                                <h3 className="text-lg font-semibold">Toplam</h3>
                                <div className="flex justify-between text-lg mb-4">
                                    <span>Ödenecek Tutar:</span>
                                    <span className="font-semibold">₺{totalCost}</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div
                                    onClick={() => addPayment('cash')}
                                    className="flex justify-center items-center w-full bg-green-700 text-white p-4 rounded-lg hover:opacity-90 transition duration-300 mb-2 cursor-pointer"
                                >
                                    <IoCashOutline className="mr-2"/>
                                    Nakit
                                </div>
                                <div
                                    onClick={() => addPayment('card')}
                                    className="flex justify-center items-center w-full bg-blue-500 text-white p-4 rounded-lg hover:opacity-90 transition duration-300 mb-2 cursor-pointer"
                                >
                                    <IoCardOutline className="mr-2"/>
                                    Kart
                                </div>
                                <div
                                    onClick={() => addPayment('other')}
                                    className="flex justify-center items-center w-full border border-gray-300 p-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer"
                                >
                                    Diğer
                                </div>
                            </div>
                            <div className="w-full">
                                {paymentHistory.map((payment, index) => (
                                    <div className="flex justify-between items-center mb-4" key={index}>
                                        <div className="flex items-center">
                                            {/* Reduce Payment Icon */}
                                            <span
                                                className="cursor-pointer text-red-500 mr-3"
                                                onClick={() => changePayment(payment.type, "reduce")}
                                            >
                                             <IoRemoveCircleOutline size={24}/>
                                            </span>
                                            {/* Payment Type and Amount */}
                                            <div>
                                                {payment.type === "cash" ? (<>
                                                    <IoCashOutline className="inline mr-2" size={24}/>
                                                    Nakit
                                                </>) : payment.type === "card" ? (<>
                                                    <IoCardOutline className="inline mr-2" size={24}/>
                                                    Kart
                                                </>) : ("Diğer")}
                                                : <span className="font-semibold">₺{payment.amount}</span>
                                            </div>
                                            {/* Increase Payment Icon */}
                                            <span
                                                className="cursor-pointer text-green-500 ml-3"
                                                onClick={() => changePayment(payment.type, "increase")}
                                            >
                                             <IoAddCircleOutline size={24}/>
                                            </span>
                                        </div>
                                        {/* Delete Payment Icon */}
                                        <span
                                            className="cursor-pointer text-red-500"
                                            onClick={() => changePayment(payment.type, "delete")}
                                        >
                                            <IoTrashOutline size={24}/>
                                        </span>
                                    </div>))}
                            </div>
                            <button
                                className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 cursor-pointer"
                                onClick={() => submitPayment()}
                                disabled={totalCost !== 0}
                            >
                                Ödemeyi Tamamla
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

    );
};

export default PaymentModal;
