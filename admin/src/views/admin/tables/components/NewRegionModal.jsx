import React, {useState} from 'react';
import Modal from "../../../../components/modal";
import {useMutation,  useQueryClient} from "react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";

const NewOrderModal = ({isOpen, onClose,setSelectedRegion}) => {

    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const [regionName, setRegionName] = useState('');

    const mutation = useMutation(async (data) => {
        const response = await axiosPrivate.post('/region', data);
        return response.data;
    }, {
        onSuccess: (response) => {
            queryClient.invalidateQueries("regions");
            setSelectedRegion(response.data.regionId)
            onClose();

        },
        onError: (error) => {
            console.error('Error submitting data:', error);
        },
    });


    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"extraLarge"}
               title={"Bolge tanimlama"} className="rounded-lg shadow-lg">
            <input type="text"
                   className={"bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"}
                   placeholder={"Bolge adi"}
                   onChange={(e) => setRegionName(e.target.value)}
                   value={regionName}/>

            <button
                onClick={() => mutation.mutate({regionName: regionName, branchId: auth.branchId})}
                disabled={mutation.isLoading} // Butonu kaydetme durumuna göre devre dışı bırak
                className={`
                ${mutation.isLoading
                    ? "bg-brand-300 text-white cursor-not-allowed"
                    : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"}
                     border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-3`}
            >
                {mutation.isLoading ? "Masa oluşturuluyor..." : "Kaydet"} {/* Buton metni duruma göre değişir */}
            </button>
        </Modal>
    );
};

export default NewOrderModal;
