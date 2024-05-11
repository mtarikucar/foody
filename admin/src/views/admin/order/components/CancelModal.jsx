import React, {useState} from 'react';
import Modal from "../../../../components/modal";
import {useMutation, useQuery, useQueryClient} from "react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
import Card from "../../../../components/card";
import Payment from "../../payment";

const NewOrderModal = ({isOpen, onClose, regionId}) => {

    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const [tableName, setTableName] = useState('');

    const mutation = useMutation(async (data) => {
        const response = await axiosPrivate.post('/table', data);
        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("tables");
            onClose();
        },
        onError: (error) => {
            console.error('Error submitting data:', error);
        },
    });


    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"large"}
               title={"masa islemleri"} className="rounded-lg shadow-lg">
            <div className={"grid sm:grid-cols-3 grid-cols-2 gap-5"}>
                <Card
                    extra={`flex w-full justify-center items-center text-xl font-bold text-navy-700 dark:text-white min-h-[4rem] border-2 !border-none size-24`}>
                    ode
                </Card>
            </div>

        </Modal>
    );
};

export default NewOrderModal;
