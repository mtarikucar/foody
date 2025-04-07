import React, { useState } from 'react';
import useAuth from "../../../hooks/useAuth";
import { useQuery, useQueryClient } from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Spinner from "../../../components/Spinner/Spinner";
import { FaEllipsisH } from 'react-icons/fa';
import { useSocket } from 'context/socket/useWebSocket';

const OrderTracking = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const {socket} = useSocket();
    const queryClient = useQueryClient();
    const [expandedOrders, setExpandedOrders] = useState({});

    // useEffect(() => {
    //     if (!socket || !auth.currentUser) return;

    //     const subscribeToNotification = async () => {
    //         if (socket.connected) {
    //             socket.subscribe(`/topic/notification/${auth.currentUser}`, (message) => {
    //                 try {
    //                     const body = message.body ? JSON.parse(message.body) : null;
    //                     if (body) {
    //                         console.log('Notification received:', body);
    //                         queryClient.invalidateQueries(['orderTracking']);
    //                     }
    //                 } catch (error) {
    //                     console.error('Error parsing notification:', error);
    //                 }
    //             });
    //         } else {
    //             await reconnectWebSocket();
    //         }
    //     };

    //     subscribeToNotification();

    //     return () => {
    //         if (socket.connected) {
    //             socket.unsubscribe(`/topic/notification/${auth.currentUser}`);
    //         }
    //     };
    // }, [socket, auth.currentUser, queryClient]);


    const { data: orderTracking, isLoading: isOrderLoading } = useQuery(['orderTracking'], async () => {
        const response = await axiosPrivate.get(`/orders?branchId=${auth.branchId}&status=1`);
        return response.data.data;
    });

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };


    const reconnectWebSocket = async () => {
        try {
            if (!socket.connected) {
                await socket.disconnect();
                await socket.connect();
            }
            console.log('WebSocket bağlantısı yeniden kuruldu');
        } catch (error) {
            console.error('WebSocket bağlantısı başarısız:', error);
        }
    };

    return (
        <div className="py-4 min-h-screen">
            {isOrderLoading ? (
                <div className="flex justify-center">
                    <Spinner loading={true} size={48} />
                </div>
            ) : orderTracking && orderTracking.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {orderTracking.map(order => {
                        const isExpanded = expandedOrders[order?.orderId] || false;
                        const visibleItems = isExpanded ? order.orderDetails : order.orderDetails.slice(0, 3);

                        return (
                            <div key={order?.orderId} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-bold">Sipariş #{order.orderId.substring(0, 8)}</h2>
                                    <span
                                        className={`px-3 rounded-full text-white ${order.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {order.status === 1 ? 'Aktif' : 'Pasif'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <span>{new Date(order?.orderDate).toLocaleDateString()}</span>
                                </p>
                                <div
                                    className="flex flex-wrap items-center justify-between text-gray-700 dark:text-gray-300 mt-3 gap-4">
                                    <p className="text-base font-semibold">
                                        Masa: <span
                                        className="font-bold text-blue-600">{order.table?.tableName || 'Bilinmiyor'}</span>
                                    </p>
                                    <p className="text-base font-medium">
                                        <span className="text-gray-500 dark:text-gray-400">Toplam Tutar:</span>
                                        <span className="font-bold text-green-600"> ₺{order.totalAmount}</span>
                                    </p>

                                </div>
                                <h3 className="text-md font-semibold mt-2">Ürünler:</h3>
                                <table className="w-full mt-2 border-collapse border border-gray-200">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-200 p-2 text-left">Ürün</th>
                                        <th className="border border-gray-200 p-2 text-left">Adet</th>
                                        <th className="border border-gray-200 p-2 text-left">Fiyat</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {visibleItems.map((detail, index) => (
                                        <tr key={index} className="border border-gray-200">
                                            <td className="border border-gray-200 p-2">{detail.product.name}</td>
                                            <td className="border border-gray-200 p-2">{detail.quantity}</td>
                                            <td className="border border-gray-200 p-2">₺{detail.product.price}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                {order.orderDetails.length > 3 && (
                                    <div
                                        className="mt-2 flex justify-center text-blue-500 cursor-pointer"
                                        onClick={() => toggleOrderDetails(order?.orderId)}
                                    >
                                        {isExpanded ? 'Daha az göster' : <FaEllipsisH/>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <p className="text-xl font-semibold text-gray-500">Henüz sipariş bulunmamaktadır.</p>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
