import React, {useEffect, useState} from 'react';

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import {useQuery, useQueryClient,} from "react-query";
import {useWebSocket} from "../../../context/socket/WebSocketContext";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";

import tableImage from "../../../assets/img/table/table.png";
import Spinner from "../../../components/Spinner/Spinner";

const Order = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();


    const [selectedRegion, setSelectedRegion] = useState(null);
    const [receivedData, setReceivedData] = useState([]);

    const socket = useWebSocket()


    useEffect(() => {
        if (socket) {
            socket.subscribe('/topic/order/' + auth.branchId, (message) => {
                setReceivedData(receivedData => [...receivedData, JSON.parse(message.body)]);
            });
        }

        return () => {
            if (socket) {
                socket.unsubscribe('/topic/order/' + auth.branchId);
            }
        }
    }, [socket, auth.branchId,])


    useEffect(() => {
        if (receivedData.length !== 0) {
            queryClient.invalidateQueries("orders");
            toast('yeni siparis geldi')
        }
    }, [receivedData, queryClient]);


    const {
        data: orders,
    } = useQuery(['orders'], async () => {
        const response = await axiosPrivate.get(`/orders?branchId=${auth?.branchId}&status=1`);
        return response.data.data;
    });

    const {data: tables, isLoading, isError} = useQuery(['tables', auth.branchId], async () => {
        const {data} = await axiosPrivate.get(`/table?branchId=${auth.branchId}`);
        return data.data;
    });

    const {data: regions} = useQuery(['regions', auth.branchId], async () => {
        const {data} = await axiosPrivate.get(`/region?branchId=${auth.branchId}`);
        return data.data;
    });

    const groupedTables =tables && tables.reduce((acc, table) => {
        (acc[table.regionId] = acc[table.regionId] || []).push(table);
        return acc;
    }, {});

    const hasActiveOrder = (tableId) => {
        return orders?.some(order => order.tableId === tableId);
    }

    if (isLoading) return <div><Spinner loading={true} size={64}/></div>;
    if (isError) return <div>Error fetching tables</div>;

    return (
        <>
            <div className="mt-3 flex flex-col justify-center items-center w-full gap-5">

                <div
                    className={"h-fit w-full bg-white rounded-md drop-shadow-lg flex flex-col justify-center items-center gap-5"}>
                    <div className={"  text-xl font-bold text-navy-700 dark:text-white mt-2"}>
                        Siparişler
                    </div>
                    <div className={"flex flex-col sm:flex-row items-center justify-between w-full mx-3 px-4 "}>
                        <div className={"flex w-full sm:w-1/2 overflow-auto "}>
                            {regions && regions?.map(region => (
                                <div
                                    className={`bg-gray-50 mt-2 h-16 flex justify-center items-center text-xl w-32 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-200 ease-in-out duration-300 uppercase m-2 ${selectedRegion === region.regionId ? "bg-indigo-700 text-white" : "text-gray-900"}`}
                                    onClick={() => setSelectedRegion(selectedRegion === region.regionId ? null : region.regionId)}>
                                    {region.regionName}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className={" w-full h-full bg-white rounded-md drop-shadow-lg flex flex-col items-center gap-5"}>

                        {regions && tables && regions.map(region => (
                            <div key={region?.regionId} className="w-full px-4 py-2">
                                <h3 className="text-lg font-bold mb-2">{region?.regionName}</h3>
                                <div
                                    className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 w-full">

                                        {groupedTables[region?.regionId]?.map(table => (
                                                <NavLink to={`/admin/order/${table.tableId}`} className={`relative w-full p-4 m-auto ${hasActiveOrder(table.tableId) ? "animate-pulse bg-amber-400" : "bg-white"} shadow-lg rounded-2xl dark:bg-gray-900 hover:drop-shadow-lg hover:bg-opacity-50 ease-in-out duration-300`}>

                                            <div className="w-full h-full text-center">
                                                <div className="flex flex-col justify-between w-full h-full">

                                                    <img className="max-w-24 m-auto mt-4 text-gray-800 dark:text-white"
                                                         src={tableImage} alt=""/>
                                                    <p className="absolute text-sm italic text-gray-800 dark:text-white top-2 right-2">
                                                        {
                                                            regions && regions.find(region => region?.regionId === table?.regionId)?.regionName
                                                        }
                                                    </p>
                                                    <p className="mt-4 uppercase text-lg text-gray-900 dark:text-white">
                                                        {table?.tableName}
                                                    </p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                                <hr className="my-4"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;
