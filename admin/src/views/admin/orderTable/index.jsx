import React, { useEffect, useState } from 'react';
import useAuth from "../../../hooks/useAuth";
import { useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useWebSocket} from "../../../context/socket/WebSocketContext";
import Temporary from "./components/Temporary";
import Addition from "./components/Addition";
import PaymentModal from "../order/components/PaymentModal";
import QuickPaymentModal from "../order/components/QuickPaymentModal";
import Spinner from "../../../components/Spinner/Spinner";
import {toast} from "react-toastify";
import { IoMdAdd,IoIosRemove } from "react-icons/io";

const OrderTable = () => {
    const [addedProducts, setAddedProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [paymentModal, setPaymentModal] = useState(false);
    const [quickPaymentModal, setQuickPaymentModal] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const { id } = useParams();
    const location = useLocation();
    const socket = useWebSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        const subscribeToOrderTopic = () => {
            if (socket.connected) {
                socket.subscribe(`/topic/order/${auth.branchId}/${id}`, (message) => {
                    const body = message.body && JSON.parse(message.body);
                    if (body && body.length > 0) {
                        queryClient.invalidateQueries(["orders"]);
                        queryClient.invalidateQueries(['additionOrder']);
                        queryClient.invalidateQueries(['tableOrder']);
                    }
                });
            } else {
                reconnectWebSocket();
            }
        };

        subscribeToOrderTopic();

        return () => {
            if (socket.connected) {
                socket.unsubscribe(`/topic/order/${auth.branchId}/${id}`);
            }
        };
    }, [socket, location, auth.branchId, id, queryClient]);

    const { data: categories, isLoading: isCategoryLoading, isSuccess: isCategorySuccess } = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data.data;
    });

    const { data: products, isLoading: isProductLoading } = useQuery(['products', category], async () => {
        const response = await axiosPrivate.get(`/product/list-non-pageable`, {
            params: { companyId: auth.companyId, menuId: auth.menuId, categoryId: category }
        });
        return response.data.data;
    });

    const { data: orders, isLoading: isOrderLoading } = useQuery(['tableOrder'], async () => {
        const response = await axiosPrivate.get(`/orders?branchId=${auth.branchId}&status=1&tableId=${id}`);
        return response.data.data;
    });

    const submitQuickPayment = async () => {
        try {
            if (!socket.connected) {
                await reconnectWebSocket();
            }
            const orderIds = orders.map(order => order.orderId);
            const amount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
            const payload = {
                tableId: id,
                amount: amount,
                cash: amount,
                card: null,
                other: null,
                orderIds: orderIds,
            };

            socket.send(`/app/addition/${auth.branchId}/${id}`, {}, JSON.stringify(payload));
            socket.send(`/app/notification/${auth.currentUser}`, {}, JSON.stringify({
                content: "Ödeme tamamlanmıştır.",
                userId: auth.currentUser,
                createTimestamp: new Date().getTime()
            }));
            toast("Ödeme tamamlandı");

            queryClient.invalidateQueries(['additionOrder']);
            queryClient.invalidateQueries(['tableOrder']);
        } catch (error) {
            console.error('Payment submission failed:', error);
            toast('Payment failed');
        }
    };

    const reconnectWebSocket = async () => {
        try {
            if (!socket.connected) {
                await socket.disconnect();
                await socket.connect();
            }
            console.log('WebSocket connection reestablished');
        } catch (error) {
            console.error('WebSocket reconnection failed:', error);
        }
    };



    const handleCategoryClick = (categoryId) => {
        if (category === categoryId) {
            setCategory(null); // Seçiliyse kaldır
        } else {
            setCategory(categoryId); // Seçili değilse ayarla
        }
    };

    return (
        <>
            <PaymentModal isOpen={paymentModal} onClose={() => setPaymentModal(!paymentModal)} tableId={id} socket={socket} />
            <QuickPaymentModal isOpen={quickPaymentModal} onClose={() => setQuickPaymentModal(!quickPaymentModal)} tableId={id} socket={socket} />

            <div className="mt-3 grid h-full grid-cols-1 md:grid-cols-3 gap-y-4 lg:gap-5">
                <div className="h-dvh">
                    {addedProducts.length > 0 && (
                        <Temporary
                            addedProducts={addedProducts}
                            setAddedProducts={setAddedProducts}
                            reconnectWebSocket={reconnectWebSocket}
                        />
                    )}

                    <Addition submitQuickPayment={submitQuickPayment} setPaymentModal={setPaymentModal} orders={orders}
                              isOrderLoading={isOrderLoading}/>
                </div>

                <div className="col-span-2  py-2 h-dvh">
                    <div
                        className="border-2 bg-white rounded-md border-opacity-50 grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-2 p-3">
                        {isCategoryLoading ? <Spinner loading={true} size={24}/> : null}
                        {isCategorySuccess && categories.length > 0 && categories.map(item => (
                            <div
                                key={item.categoryId}
                                className={`rounded w-full ${category === item.categoryId ? "bg-indigo-500 text-white" : ''} p-3 cursor-pointer flex border-2 border-indigo-500 hover:text-white items-center justify-center hover:bg-indigo-500 transition-colors mx-1`}
                                onClick={() => handleCategoryClick(item.categoryId)}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex justify-center items-center py-4">
                        {isProductLoading ? <Spinner loading={true} size={48}/> : null}
                    </div>

                    <div
                        className="col-span-2 bg-white rounded-lg p-2 grid grid-cols-2 border-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {products?.map(product => (
                            <div
                                key={product.productId}
                                className="relative w-full h-48 bg-white shadow-lg rounded-2xl dark:bg-gray-900 cursor-pointer bg-opacity-50 transition ease-in-out duration-300 overflow-hidden"
                                onClick={() => setAddedProducts([...addedProducts, product])}
                                style={{
                                    backgroundImage: `url(${product.images ? product.images[0] : ""})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'brightness(80%)'
                                }}
                            >
                                <div
                                    className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                                    <p className="text-sm italic text-white mb-2">{product.category}</p>
                                    <p className="text-md text-white font-bold mb-2">{product.name}</p>
                                    <p className="text-xs font-thin text-white">₺{product.price}.00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderTable;
