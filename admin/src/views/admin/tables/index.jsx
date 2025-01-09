import React, { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "react-query";
import NewRegionModal from "./components/NewRegionModal";
import AddTableModal from "./components/AddTableModal";
import { BsTrash } from "react-icons/bs";
import tableImage from "../../../assets/img/table/table.png";
import Spinner from "../../../components/Spinner/Spinner";

const Tables = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();

    const [newRegionModal, setNewRegionModal] = useState(false);
    const [addTableModal, setAddTableModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const { data: tables, isLoading: isTablesLoading, isError: isTablesError } = useQuery(['tables', auth.branchId], async () => {
        const { data } = await axiosPrivate.get(`/table?branchId=${auth.branchId}`);
        return data.data;
    });

    const { data: regions, isLoading: isRegionsLoading, isError: isRegionsError } = useQuery(['regions', auth.branchId], async () => {
        const { data } = await axiosPrivate.get(`/region?branchId=${auth.branchId}`);
        return data.data;
    });

    const deleteRegionMutation = useMutation(async () => {
        const response = await axiosPrivate.delete(`/region/${selectedRegion}`);
        return response.data;
    }, {
        onSuccess: () => {
            // Sorguları tekrar çalıştırarak güncel veriyi getir
            queryClient.invalidateQueries("regions");
            queryClient.invalidateQueries("tables");
            setSelectedRegion(null); // Seçilen bölgeyi temizle
        },
        onError: (error) => {
            console.error('Error deleting region:', error);
        },
    });

    if (isTablesLoading || isRegionsLoading) return <div><Spinner loading={true} size={60} /></div>;
    if (isTablesError || isRegionsError) return <div>Error fetching data</div>;

    const groupedTables = tables?.reduce((acc, table) => {
        (acc[table.regionId] = acc[table.regionId] || []).push(table);
        return acc;
    }, {});

    return (
        <div className="mt-3 bg-white h-dvh flex flex-col justify-center w-full gap-5">
            <NewRegionModal
                setSelectedRegion={setSelectedRegion}
                isOpen={newRegionModal}
                onClose={() => setNewRegionModal(false)}
            />
            <AddTableModal
                tables={tables}
                isOpen={addTableModal}
                onClose={() => setAddTableModal(false)}
                regionId={selectedRegion}
            />
            <div className="h-dvh w-full rounded-md   flex flex-col items-center gap-2">
                <div className="text-2xl font-bold text-navy-700 dark:text-white mt-2">
                    {selectedRegion ?
                        (regions && regions.length > 0 ?
                            `Seçili Bölge: ${regions.find(region => region.regionId === selectedRegion)?.regionName}`
                            : "Bölge bulunamadı")
                        : "Bütün Masalar"}
                </div>
                <div className="grid bg-white grid-cols-1 md:grid-cols-6 w-full h-full">
                    <div className="col-span-1 flex flex-col items-center p-4 border-r border-gray-200">
                        <button
                            onClick={() => setNewRegionModal(true)}
                            className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mt-2"
                        >
                            Yeni Bölge Ekle
                        </button>
                        <div className="grid grid-cols-2 w-full gap-2 mt-2">
                            {selectedRegion && (
                                <>
                                    <div
                                        onClick={() => deleteRegionMutation.mutate()}
                                        className="bg-red-700 border cursor-pointer text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    >
                                        {deleteRegionMutation.isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-200"></div>
                                            </div>
                                        ) : (
                                            <BsTrash className="w-5 h-5 mx-auto" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setAddTableModal(true)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    >
                                        Masa Ekle
                                    </button>
                                </>
                            )}
                        </div>
                        {regions && regions.length > 0 && (
                            <div className="w-full mt-4">
                                {regions.map((region) => (
                                    <div
                                        key={region.regionId}
                                        className={`bg-gray-50 mt-2 h-16 flex justify-center items-center text-xl w-full py-2 border rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white ease-in-out duration-300 uppercase ${selectedRegion === region.regionId ? "bg-indigo-700 text-white" : "text-gray-900"}`}
                                        onClick={() => setSelectedRegion(selectedRegion === region.regionId ? null : region.regionId)}
                                    >
                                        {region.regionName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-span-5 h-dvh flex flex-col items-center p-4">
                        {selectedRegion && tables ? (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 w-full p-2.5">
                                {groupedTables[selectedRegion]?.map(table => (
                                    <div key={table.tableId} className="relative w-full p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-900">
                                        <div className="w-full h-full text-center">
                                            <div className="flex flex-col justify-between h-full">
                                                <img className="max-w-24 m-auto mt-4 text-gray-800 dark:text-white" src={tableImage} alt=""/>
                                                <p className="absolute text-sm italic text-gray-800 dark:text-white top-2 right-2">
                                                    {table.tableName}
                                                </p>
                                                <p className="mt-4 uppercase text-lg text-gray-900 dark:text-white">{table.tableName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            regions && tables && regions.map(region => (
                                <div key={region.regionId} className="w-full px-4 py-2">
                                    <h3 className="text-lg font-bold mb-2">{region.regionName}</h3>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 w-full">
                                        {groupedTables[region.regionId]?.map(table => (
                                            <div key={table.tableId} className="relative w-full p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-900">
                                                <div className="w-full h-full text-center">
                                                    <div className="flex flex-col justify-between h-full">
                                                        <img className="max-w-24 m-auto mt-4 text-gray-800 dark:text-white" src={tableImage} alt=""/>
                                                        <p className="absolute text-sm italic text-gray-800 dark:text-white top-2 right-2">
                                                            {region.regionName}
                                                        </p>
                                                        <p className="mt-4 uppercase text-lg text-gray-900 dark:text-white">{table.tableName}</p>
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
            </div>
        </div>
    );
};

export default Tables;
