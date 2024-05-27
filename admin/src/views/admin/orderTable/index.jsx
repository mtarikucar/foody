import React, {useEffect, useState} from 'react';


import useAuth from "../../../hooks/useAuth";
import {useLocation, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useWebSocket} from "../../../context/socket/WebSocketContext";
import Temporary from "./components/Temporary";
import Addition from "./components/Addition";
import PaymentModal from "../order/components/PaymentModal";
import QuickPaymentModal from "../order/components/QuickPaymentModal";
import Spinner from "../../../components/Spinner/Spinner";
import {toast} from "react-toastify";


const OrderTable = () => {


    const [addedProducts, setAddedProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [paymentModal, setPaymentModal] = useState(false);
    const [quickPaymentModal, setQuickPaymentModal] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const {id} = useParams();
    const location = useLocation();
    const socket = useWebSocket()
    const queryClient = useQueryClient();


    useEffect(() => {
        if (!socket) return;
        socket.subscribe('/topic/order/' + auth.branchId + "/" + id, (message) => {
            if (JSON.parse(message.body.length > 0)) {
                queryClient.invalidateQueries("orders");
                queryClient.invalidateQueries("tableOrder");
            }
        });
        return () => {
            socket.unsubscribe('/topic/order/' + id);
        }
    }, [socket, location, auth.branchId, id, queryClient])


    const {
        data: categories,
        isLoading: isCategoryLoading,
        isSuccess: isCategorySuccess
    } = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data.data;
    });

    const {
        data: products,
        isLoading: isProductLoading,
    } = useQuery(['products', category], async () => {
        const response = await axiosPrivate.get(`/product/list-non-pageable`, {
            params: {
                companyId: auth.companyId, menuId: auth.menuId, categoryId: category
            }
        });
        return response.data.data;
    });

    const {
        data: orders,
        isLoading: isOrderLoading
    } = useQuery(['tableOrder'], async () => {
        const response = await axiosPrivate.get(`/orders?branchId=${auth?.branchId}&status=1&tableId=${id}`);
        return response.data.data;
    });


    const submitQuickPayment = async () => {
        try {
            if (!socket.connected) {

                await reconnectWebSocket();
            }
            const orderIds = orders.map(order => order.orderId); // Assuming each order has an ID
            const amount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
            const payload = {
                tableId: id,
                amount: amount,
                cash: amount,
                card:  null,
                other:  null,
                orderIds: orderIds,
            };

            socket.send("/app/addition/" + auth.branchId + "/" + id, {}, JSON.stringify(payload));
            socket.send("/app/notification/" + auth.currentUser, {}, JSON.stringify({
                content: "ödeme tamalanmıştır.", userId: auth.currentUser, createTimestamp: new Date().getTime()
            }));
            toast("ödeme tamamlandı");

            queryClient.invalidateQueries(['additionOrder']);
        } catch (error) {
            console.error('Payment submission failed:', error);
            toast('Payment failed');
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
    return (<>

        <PaymentModal isOpen={paymentModal} onClose={() => setPaymentModal(!paymentModal)} tableId={id}
                      socket={socket}/>
        <QuickPaymentModal isOpen={quickPaymentModal} onClose={() => setQuickPaymentModal(!quickPaymentModal)}
                           tableId={id} socket={socket}/>

        <div className="mt-3 grid h-full grid-cols-1 sm:grid-cols-3 gap-5">

            <div className={"max-h-dvh overflow-y-scroll "}>

                <div className={"overflow-y-scroll"}>
                    {addedProducts.length > 0 &&
                        <Temporary addedProducts={addedProducts} setAddedProducts={setAddedProducts} />
                    }
                </div>
                <Addition orders={orders} isOrderLoading={isOrderLoading}/>
                {
                    orders?.length > 0 &&
                    <div className={" sticky bottom-0  w-full  rounded-t flex justify-center items-center"}>
                        <div className={"flex justify-center items-center w-full"}>


                            <div
                                className={"flex justify-center items-center hover:bg-gray-200 ease-in-out duration-300 size-16 rounded drop-shadow-lg  m-4 bg-white cursor-pointer w-full"}
                                onClick={() => {
                                    setPaymentModal(true)
                                }}>
                                öde
                            </div>

                            <div
                                className={"flex justify-center items-center hover:bg-gray-200 ease-in-out duration-300 size-16 rounded drop-shadow-lg  m-4 bg-white cursor-pointer w-full"}
                                onClick={() => {
                                    submitQuickPayment()
                                }}>
                                hızlı öde
                            </div>

                        </div>
                    </div>
                }
            </div>


            <div className=" col-span-2 max-h-dvh overflow-y-scroll">
                <div className="border-2 border-opacity-50 flex  items-start justify-start rounded overflow-x-scroll">

                    <Spinner loading={isCategoryLoading} size={24}/>
                    {isCategorySuccess && categories.length > 0 && categories?.map(item =>
                        <div
                            key={item.categoryId}
                            className={`rounded w-full ${category === item.categoryId ? "bg-indigo-500 text-white" : ''} p-3 drop-shadow-lg  flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors min-w-[250px]`}
                            onClick={() => setCategory(item.categoryId)}>
                            {item.name}
                        </div>
                    )}
                </div>
                <div className={"w-full flex justify-center items-center"}>
                    <Spinner loading={isProductLoading} size={48}/>
                </div>

                <div
                    className="border-2 border-opacity-50 col-span-2 rounded p-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:col-span-4 gap-5">
                    {products?.map(product =>

                        <div
                            key={product.productId}
                            className="relative w-48 sm:w-64 p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-900 cursor-pointer hover:bg-opacity-50"
                            onClick={() => setAddedProducts([...addedProducts, product])}>

                            <div className="w-full h-full text-center">
                                <div className="flex flex-col justify-between h-full">
                                   {/* <img src={product.images[0]} alt="product" className={"rounded drop-shadow"}/>*/}
                                    <p className="absolute text-sm italic text-gray-800 dark:text-white top-2 right-2">
                                        {product.category}
                                    </p>
                                    <p className="mt-4 text-lg text-gray-900 dark:text-white">
                                        {product.name}
                                    </p>
                                    <p className="px-6 py-2 text-xs font-thin text-gray-700 dark:text-gray-50">
                                        {product.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>);
};

export default OrderTable;


/**/
