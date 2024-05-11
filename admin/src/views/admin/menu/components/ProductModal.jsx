import {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Modal from '../../../../components/modal';
import CustomCard from '../../../../components/card/CustomCard';
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
function ProductModal({isOpen, onClose}) {

    const [devam, setDevam] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const companyId = useSelector((state) => state.auth.companyId);
    const {id} = useParams()
    const queryClient = useQueryClient();

    const {data: addProducts, isLoading, error} = useQuery('addProducts', async () => {
        const response = await axiosPrivate.get(`/product/${id}/company/${companyId}`);
        return response.data;
    });

    const {mutate} = useMutation(data => axiosPrivate.post(`/menu/${id}/products`, data), {

        onSuccess: (data) => {
            toast.success("Ürün başarıyla eklendi");
            queryClient.invalidateQueries('products');
            setDevam(false)
        },
        onError: (error) => {
            toast.error("Ürün başarıyla eklendi");
            setDevam(false)
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
        setDevam(true)
        mutate(selectedProducts);
    };

    return (
        <Modal title={'urun-menu'} description={"menuyu ekleyebillecegin urunler"} size="extraLarge" isOpen={isOpen}
               onClose={onClose}>
            {/*<input type="text" placeholder="Ara..." onChange={(e) => setSearchTerm(e.target.value)}/>*/}
            {/* Category filter dropdown here */}
            <div className="grid grid-cols-3 gap-4 ">
                {addProducts?.map(product => (
                    <div key={product.productId} onClick={() => handleCardClick(product.productId)}>
                        <CustomCard
                            title={product.name}
                            // Other product details
                            isSelected={selectedProducts.includes(product.productId)}
                        />
                    </div>
                ))}
            </div>
            <button
                disabled={selectedProducts.length===0}
                className={`border m-2 bg-gray-200 p-2  ${selectedProducts.length===0 ? "":"bg-purple-600 text-white" } rounded ease-in-out duration-200`}
                onClick={handleSave}>
                {
                    devam ? "Yükleniyor..." : "kaydet"
                }
            </button>

        </Modal>
    );
}

export default ProductModal;
