import {useState} from 'react';
import { useMutation, useQueryClient} from 'react-query';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Modal from '../../../../components/modal';
import CustomCard from '../../../../components/card/CustomCard';
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import PhotoUpload from "../../../../components/PhotoUpload";
import {toast} from "react-toastify";
import {Button} from "@chakra-ui/button";

function AddBanner({ isOpen, onClose, banners }) {
    const [file, setFile] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { mutate } = useMutation(data => axiosPrivate.put(`/menu/${id}`, {
        banners: banners ? [...banners, data] : [data]
    }), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["menuData", id]);
            toast("Banner başarıyla eklendi");
            onClose();
        },
        onError: (error) => {
            toast.error("Banner eklenirken bir hata oldu");
        },
    });

    const handleSave = () => {
        if (file) {
            mutate(file);
        } else {
            toast.error("Lütfen bir dosya seçin");
        }
    };

    return (
        <Modal title={'Yeni Banner'} description={"Yeni banner ekleyin"} size="medium" isOpen={isOpen} onClose={onClose}>
            <div className={" h-full w-80"}>
                <PhotoUpload size={256} multiImage={false} onFileDataChange={(file) => setFile(file)}/>
                <div className="flex w-full justify-end gap-2 mt-4">
                    <Button className={"w-full p-2 bg-red-500 hover:-translate-y-1 ease-in-out duration-200 text-white rounded-md"} onClick={onClose}>İptal Et</Button>
                    <Button className={"w-full p-2 bg-indigo-500 hover:-translate-y-1 ease-in-out duration-200 text-white rounded-md"} onClick={handleSave}>Kaydet</Button>
                </div>
            </div>
        </Modal>
    );
}

export default AddBanner;
