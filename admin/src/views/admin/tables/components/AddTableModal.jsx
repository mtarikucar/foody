import React, {useState} from 'react';
import Modal from "../../../../components/modal";
import {useMutation,  useQueryClient} from "react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";

const NewOrderModal = ({isOpen, onClose, regionId, tables}) => {

    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();

    const [tableName, setTableName] = useState('');
    const [tableCount, setTableCount] = useState(1);  // Masa sayısı için state
    const filterTables = tables && tables.filter(table => table.regionId === regionId)

    const mutation = useMutation(async (data) => {
        const responses = [];
        for (let i = 1; i <= data?.count; i++) {
            const response = await axiosPrivate.post('/table', {
                regionId: data?.regionId,
                tableName: `${tableName ? tableName : "Masa"} ${filterTables ? filterTables.length + i : i}`,  // Masa adını indeksle birleştir
                branchId: data?.branchId
            });
            responses.push(response.data);
        }
        return responses;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("tables");
            onClose();
        },
        onError: (error) => {
            console.error('Error submitting data:', error);
        },
    });

    const handleSave = () => {
        mutation.mutate({regionId: regionId, tableName: tableName, branchId: auth.branchId, count: tableCount});
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"extraLarge"} title={"Yeni masa(lar) ekle"}
               className="rounded-lg shadow-lg">
            <div className="">
                <p className="text-sm text-gray-900 mb-4">
                    Masa adını giriniz ve oluşturmak istediğiniz masa sayısını belirtiniz. Birden fazla masa oluşturmak
                    isterseniz,
                    masa adı otomatik olarak numaralandırılacaktır.
                </p>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-3">
                        <label htmlFor="tableName" className="block text-sm font-medium text-gray-700">Masa adı</label>
                        <input
                            id="tableName"
                            type="text"
                            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Masa adı"
                            onChange={(e) => setTableName(e.target.value)}
                            value={tableName}
                        />
                    </div>
                    <div className="col-span-3">
                        <label htmlFor="tableCount" className="block text-sm font-medium text-gray-700">Masa
                            sayısı</label>
                        <input
                            id="tableCount"
                            type="number"
                            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Masa sayısı"
                            onChange={(e) => setTableCount(e.target.value)}
                            value={tableCount}
                        />
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={mutation.isLoading} // Butonu kaydetme durumuna göre devre dışı bırak
                    className={`
                    ${mutation.isLoading
                        ? "bg-brand-300 text-white cursor-not-allowed"
                        : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"}
                         border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-3`}
                >
                    {mutation.isLoading ? "Masa oluşturuluyor..." : "Kaydet"} {/* Buton metni duruma göre değişir */}
                </button>
            </div>
        </Modal>
    );
};

export default NewOrderModal;
