import React, { useState } from 'react';
import Modal from "../../../../components/modal";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";

const NewRegionModal = ({ isOpen, onClose, setSelectedRegion }) => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const [regionName, setRegionName] = useState('');

    const mutation = useMutation(async (data) => {
        const response = await axiosPrivate.post('/region', data);
        return response.data;
    }, {
        onSuccess: (response) => {
            console.log('Region created:', response.data);
            if (response?.data?.regionId) {
                setSelectedRegion(response.data.regionId);
            }
            queryClient.invalidateQueries("regions");
            queryClient.invalidateQueries("tables");
            onClose();
        },
        onError: (error) => {
            console.error('Error submitting data:', error);
        },
    });

    const handleSave = () => {
        if (regionName.trim()) {
            mutation.mutate({ regionName: regionName, branchId: auth.branchId });
        } else {
            console.error('Bölge adı boş olamaz');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"extraLarge"} title={"Bölge tanımlama"} className="rounded-lg shadow-lg">
            <input
                type="text"
                className="bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Bölge adı"
                onChange={(e) => setRegionName(e.target.value)}
                value={regionName}
            />
            <button
                onClick={handleSave}
                disabled={mutation.isLoading}
                className={`${mutation.isLoading
                    ? "bg-brand-300 text-white cursor-not-allowed"
                    : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"}
                    border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-3`}
            >
                {mutation.isLoading ? "Bölge oluşturuluyor..." : "Kaydet"}
            </button>
        </Modal>
    );
};

export default NewRegionModal;
