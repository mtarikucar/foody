import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Modal from '../../../../components/modal';
import CustomCard from '../../../../components/card/CustomCard';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ProductModal({ isOpen, onClose }) {

    const [devam, setDevam] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const companyId = useSelector((state) => state.auth.companyId);
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: addProducts, isLoading, error } = useQuery('addProducts', async () => {
        const response = await axiosPrivate.get(`/product/${id}/company/${companyId}`);
        return response.data;
    });

    const { mutate } = useMutation(data => axiosPrivate.post(`/menu/${id}/products`, data), {
        onSuccess: () => {
            toast.success("Ürün başarıyla eklendi");
            queryClient.invalidateQueries('products');
            setDevam(false);
            onClose();
        },
        onError: () => {
            toast.error("Ürün eklenirken hata oluştu");
            setDevam(false);
        }
    });

    const handleCardClick = (productId) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    const handleSave = () => {
        setDevam(true);
        mutate(selectedProducts);
    };

    return (
        <Modal title={'Menüye Ürün Ekle'} description={"Menüye ekleyebileceğiniz ürünler"} size="extraLarge" isOpen={isOpen} onClose={onClose}>
            <div className="grid grid-cols-3 gap-4 p-4">
                {addProducts?.map(product => (
                    <div key={product.productId} onClick={() => handleCardClick(product.productId)}>
                        <CustomCard
                            title={product.name}
                            price={product.price}
                            image={product.images[0]}
                            ratings={product.ratings}
                            isSelected={selectedProducts.includes(product.productId)}
                        />
                    </div>
                ))}
            </div>
            <button
                disabled={selectedProducts.length === 0 || devam}
                className={`border m-2 p-2 w-full rounded ease-in-out duration-200 ${selectedProducts.length === 0 || devam ? "bg-gray-200" : "bg-purple-600 text-white"}`}
                onClick={handleSave}
            >
                {devam ? "Yükleniyor..." : "Kaydet"}
            </button>
        </Modal>
    );
}

export default ProductModal;
