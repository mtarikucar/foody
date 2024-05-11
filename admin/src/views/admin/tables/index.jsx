import React, {useState} from 'react';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import {useMutation, useQuery, useQueryClient} from "react-query";
import NewRegionModal from "./components/NewRegionModal";
import AddTableModal from "./components/AddTableModal";
import {BsTrash} from "react-icons/bs";
import tableImage from "../../../assets/img/table/table.png"

const Tables = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();

    const [newRegionModal, setNewRegionModal] = useState(false);
    const [addTableModal, setAddTableModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);


    const {data: tables, isLoading, isError} = useQuery(['tables', auth.branchId], async () => {
        const {data} = await axiosPrivate.get(`/table?branchId=${auth.branchId}`);
        return data.data;
    });

    const {data: regions} = useQuery(['regions', auth.branchId], async () => {
        const {data} = await axiosPrivate.get(`/region?branchId=${auth.branchId}`);
        return data.data;
    });

    const mutation = useMutation(async () => {
        const response = await axiosPrivate.delete('/region/' + selectedRegion);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("regions");
            queryClient.invalidateQueries("tables");
            selectedRegion && setSelectedRegion(null);
        },
        onError: (error) => {
            console.error('Error submitting data:', error);
        },
    });


    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching tables</div>;

    const groupedTables =tables && tables.reduce((acc, table) => {
        (acc[table.regionId] = acc[table.regionId] || []).push(table);
        return acc;
    }, {});


    return (
        <div className="mt-3 h-dvh flex flex-col justify-center w-full gap-5">
            <NewRegionModal setSelectedRegion={setSelectedRegion} isOpen={newRegionModal}
                            onClose={() => setNewRegionModal(!newRegionModal)}/>
            <AddTableModal tables={tables} isOpen={addTableModal} onClose={() => setAddTableModal(!addTableModal)}
                           regionId={selectedRegion}/>

            <div
                className={" w-full h-full bg-white rounded-md drop-shadow-lg flex flex-col items-center gap-5"}>
                <div className={"  text-2xl font-bold text-navy-700 dark:text-white mt-2"}>
                    Masalar
                </div>
                {regions && regions.length > 0 ? (
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
                        <div className={"flex items-center justify-center"}>
                            {selectedRegion &&

                                <div
                                    onClick={() => mutation.mutate()}
                                    className={"bg-red-700 border cursor-pointer  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 ml-2"}>
                                    <BsTrash className={"w-5 h-5 text-white"}/>
                                </div>

                            }
                            <div
                                className={regions && regions.length > 0 ? "flex items-center justify-center" : "flex flex-1 items-center justify-center"}>
                                <button
                                    onClick={() => setNewRegionModal(true)}
                                    className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 ml-2"}>
                                    Yeni bölge ekle
                                </button>
                            </div>
                            {selectedRegion &&
                                <button
                                    onClick={() => setAddTableModal(true)}
                                    className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 ml-2"}>
                                    Masa ekle
                                </button>
                            }
                        </div>
                    </div>
                ) : (

                    <div className="flex flex-1 items-center justify-center">
                        <button onClick={() => setNewRegionModal(true)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5">
                            Yeni bölge ekle
                        </button>
                    </div>
                )}

                    {selectedRegion && tables ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 w-full p-2.5">
                            {groupedTables[selectedRegion]?.map(table => (
                                <div key={table?.tableId}
                                     className="relative p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-900">
                                    <img src={tableImage} alt="" className="max-w-20  m-auto mt-4"/>
                                    <p className="mt-4 uppercase text-lg text-gray-900 dark:text-white">{table?.tableName}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                       regions && tables && regions.map(region => (

                            <div key={region?.regionId} className="w-full px-4 py-2">
                                <h3 className="text-lg font-bold mb-2">{region?.regionName}</h3>
                                <div
                                    className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 w-full">
                                    {groupedTables[region?.regionId]?.map(table => (
                                        <div key={table?.tableId}
                                            className="relative w-full p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-900">
                                            <div className="w-full h-full text-center">
                                                <div className="flex flex-col justify-between h-full">

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
                                        </div>
                                    ))}
                                </div>
                                <hr className="my-4"/>
                            </div>
                        ))
                    )}

            </div>

        </div>
    )
        ;
};

export default Tables;
