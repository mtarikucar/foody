
import Modal from '../../../../components/modal';
import React, { useState, useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import {Button} from "@chakra-ui/button";
import {toast} from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import uploadFileToFirebase from "../../../firebase/uploadFileToFirebase";



function DeleteProductFromMenu({ isOpen, onClose, close,id ,menuId}) {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();

    // useMutation hook'unda API çağrısını düzenle
    const { mutate } = useMutation(
        () => axiosPrivate.post(`/menu/${menuId}/products/${id}`),
        {
            onSuccess: () => {
                toast("Ürün başarıyla silindi.");
                queryClient.invalidateQueries('products');
                onClose();
                close()
            },
            onError: (error) => {
                toast.error(`Ürün silinirken bir hata oluştu: ${error.message}`);
            }
        }
    );

    const handleSubmit = () => {
        mutate();
    };

    return (
        <Modal title={'Silmeyi Onaylıyor musunuz?'} description={""} size="small" isOpen={isOpen} onClose={onClose}>
            <div className={"w-full flex justify-between"}>
                <Button
                    onClick={handleSubmit}
                    className="ml-1 flex items-center text-sm font-bold text-white hover:text-green-500 hover:bg-white hover:border-green-500 border-2 p-1.5 rounded-md bg-green-500">
                    <span className={"text-md "}>Kabul Et</span>
                </Button>

                <Button
                    onClick={onClose}
                    className="ml-1 flex items-center text-sm font-bold text-white hover:text-red-500 hover:bg-white hover:border-red-500 border-2 p-1.5 rounded-md bg-red-500">
                    <span className={"text-md "}>İptal Et</span>
                </Button>
            </div>
        </Modal>
    );
}

export default DeleteProductFromMenu;
