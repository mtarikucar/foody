import Modal from '../../../../components/modal';
import React, {useState, useEffect} from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import uploadFileToFirebase from "../../../firebase/uploadFileToFirebase";
import {toast} from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import {Button} from "@chakra-ui/button";
import DeleteProduct from "./DeleteProduct";
import DeleteProductFromMenu from "../../menus/components/DeleteProductFromMenu";
import {BsPlusSquare, BsXSquare, BsCheckCircle} from "react-icons/bs";
import {Spinner} from "@chakra-ui/spinner";

const UpdateProductSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    price: Yup.number().required('Required').positive('Price must be positive'),
    ratings: Yup.number().required('Required').min(0).max(5),
    categoryId: Yup.string().required('Required'),
    description: Yup.string().required('Description is required')
});

function UpdateProduct({isOpen, onClose, productData, menuId}) {
    const axiosPrivate = useAxiosPrivate();
    const [fileData, setFileData] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [menuProductId, setMenuProductId] = useState();
    const [deleteMenuProduct, setDeleteMenuProduct] = useState(false);
    const auth = useAuth();
    const queryClient = useQueryClient();

    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [newFeatureName, setNewFeatureName] = useState('');
    const [addFeature, setAddFeature] = useState(false);

    useEffect(() => {
        if (productData?.images) {
            setImageUrls(productData.images);
            setFileData([]);
            setSelectedFeatures(productData.featureIds || []);
        }
    }, [productData]);

    const {data: categories} = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data;
    });

    const {data: features, isSuccess} = useQuery('features', async () => {
        try {
            const response = await axiosPrivate.get(`/product/features?companyId=${auth.companyId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    });

    const addFeatureMutation = useMutation(newFeature => axiosPrivate.post('/product/features', newFeature), {
        onSuccess: () => {
            toast.success("Özellik başarıyla eklendi");
            queryClient.invalidateQueries('features');
            setNewFeatureName('');
            setAddFeature(false);
        },
        onError: () => {
            toast.error("Özellik eklenirken hata oluştu");
        }
    });

    const handleAddFeature = () => {
        if (!newFeatureName.trim()) {
            toast.error("Özellik adı boş olamaz");
            return;
        }
        addFeatureMutation.mutate({name: newFeatureName.trim(), companyId: auth.companyId});
    };

    const handleFeatureClick = (featureId) => {
        let newSelectedFeatures = [...selectedFeatures];
        if (newSelectedFeatures.includes(featureId)) {
            newSelectedFeatures = newSelectedFeatures.filter(id => id !== featureId);
        } else {
            newSelectedFeatures = [featureId, ...newSelectedFeatures];
        }
        setSelectedFeatures(newSelectedFeatures);
    };

    const {mutate} = useMutation(
        updatedData => axiosPrivate.put(`/product/${productData.productId}`, updatedData),
        {
            onSuccess: () => {
                setFileData([]);
                toast("Ürün başarıyla güncellendi.");
                queryClient.invalidateQueries("products");
                onClose();
            },
            onError: () => {
                toast.error("Ürün güncellenirken bir hata oluştu.");
            }
        }
    );

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalFiles = fileData.length + selectedFiles.length;

        if (totalFiles > 3) {
            toast.error('En fazla 3 fotoğraf yükleyebilirsiniz.');
        } else {
            setFileData([...fileData, ...selectedFiles]);
        }
    };

    const deleteProductModal = () => {
        setDeleteOpen(!deleteOpen);
    };

    const deleteMenuProductModal = () => {
        setDeleteMenuProduct(!deleteMenuProduct);
    };

    const handleRemoveImages = (imageToRemove) => {
        setImageUrls((prevImages) => prevImages.filter(image => image !== imageToRemove));
    };

    const handleRemoveImage = (indexToRemove) => {
        setFileData((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleDelete = (id) => {
        setDeleteOpen(true);
        setDeleteId(id);
    };

    const handleDeleteMenuProduct = (id) => {
        setDeleteMenuProduct(true);
        setMenuProductId(id);
        console.log(id);
    };

    const handleSubmit = async (values) => {
        try {
            // Yeni yüklenen resimlerin URL'lerini al
            const newImageUrls = fileData.length > 0 ? await Promise.all(
                fileData.map(file => uploadFileToFirebase(file))
            ) : [];

            // Mevcut ve yeni image URL'lerini birleştir
            const allImages = [...imageUrls, ...newImageUrls];

            // Veriyi göndermek için hazırla
            const dataToSend = {
                ...values,
                images: allImages,
                featureIds: selectedFeatures
            };

            // API çağrısı yap (mutate kullanılıyorsa)
            mutate(dataToSend);
        } catch (error) {
            console.error('Hata:', error);
            toast.error("Bir hata oluştu.");
        }
    };

    return (
        <Modal title={'Ürün Güncelle'} description={"Ürünü güncelleyebilir ve özellikler ekleyebilirsiniz"}
               size="extraLarge" isOpen={isOpen} onClose={onClose}>
            <DeleteProduct isOpen={deleteOpen} onClose={deleteProductModal} id={deleteId}/>
            <DeleteProductFromMenu isOpen={deleteMenuProduct} close={onClose} onClose={deleteMenuProductModal}
                                   id={menuProductId} menuId={menuId}/>
            <div className='col-span-2 lg:col-span-1 p-4 shadow-lg rounded-lg bg-white overflow-auto'>
                <div className={"grid grid-cols-2 gap-4"}>
                    <Formik
                        initialValues={{
                            name: productData?.name || '',
                            price: productData?.price || 0,
                            ratings: productData?.ratings || 0,
                            categoryId: productData?.categoryId || '',
                            description: productData?.description || ''
                        }}
                        validationSchema={UpdateProductSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize // Mevcut ürün bilgileri ile formu yeniden başlat
                    >
                        {({errors, touched,isSubmitting}) => (
                            <Form className='space-y-4'>
                                <Field name="name" placeholder="Ad"
                                       className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.name && touched.name ? <div>{errors.name}</div> : null}

                                <Field name="price" type="number" placeholder="Fiyat"
                                       className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.price && touched.price ? <div>{errors.price}</div> : null}

                                <Field name="ratings" type="number" placeholder="Değerlendirme"
                                       className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.ratings && touched.ratings ? <div>{errors.ratings}</div> : null}

                                <Field as="select" name="categoryId"
                                       className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                                    <option value="">Kategori Değiştir</option>
                                    {categories?.data?.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                {errors.categoryId && touched.categoryId ? <div>{errors.categoryId}</div> : null}

                                <Field as="textarea" name="description" placeholder="Açıklama"
                                       className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.description && touched.description ? <div>{errors.description}</div> : null}

                                <div className="flex flex-col">
                                    <label htmlFor="file-upload" className="mb-2 ml-1 text-sm font-medium text-gray-700">
                                        Resim Yükle
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className='file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
                                        disabled={fileData.length >= 3}
                                    />
                                </div>

                                <div className={"flex justify-between gap-6"}>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}  // Form gönderiliyorsa buton disabled olur
                                        className={`w-full p-2 bg-indigo-700 text-white rounded-md 
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 ease-in-out duration-200'}`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex justify-center items-center">
                                                <Spinner size="sm" className="mr-2"/> Kaydediliyor...
                                            </div>
                                        ) : (
                                            "Kaydet"
                                        )}
                                    </button>

                                    <Button
                                        onClick={() => handleDelete(productData.productId)}
                                        className="w-full p-2 bg-red-600 hover:-translate-y-1 ease-in-out duration-200 text-white rounded-md">
                                        <span className={"text-md "}>Sil</span>
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className={" "}>
                        <div className='grid grid-cols-4 p-1 gap-1 border-2 rounded-md'>
                            {imageUrls.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setHoveredImage(`image_${index}`)}
                                    onMouseLeave={() => setHoveredImage(null)}
                                >
                                    <img
                                        src={image}
                                        alt="Product"
                                        className='w-20 h-20 border-2 object-cover rounded-md'
                                    />
                                    {hoveredImage === `image_${index}` && (
                                        <button
                                            onClick={() => handleRemoveImages(image)}
                                            className="absolute top-0 bg-red-500 text-white px-2 rounded-full"
                                        >
                                            &#10005;
                                        </button>
                                    )}
                                </div>
                            ))}

                            {fileData.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setHoveredImage(`file_${index}`)}
                                    onMouseLeave={() => setHoveredImage(null)}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Product"
                                        className='w-20 h-20 border-2 object-cover rounded-md'
                                    />
                                    {hoveredImage === `file_${index}` && (
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 bg-red-500 text-white px-2 rounded-full"
                                        >
                                            &#10005;
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="col-span-2 grid grid-cols-4 mt-4 border-2 rounded-md">
                            {(isSuccess && features?.data?.length > 0 ? features.data : []).map(feature => (
                                <div
                                    key={feature?.featureId}
                                    className={`p-2 rounded-md m-2 text-center flex items-center justify-center cursor-pointer ${selectedFeatures.includes(feature?.featureId) ? 'bg-indigo-700 text-white' : 'bg-gray-300'}`}
                                    onClick={() => handleFeatureClick(feature?.featureId)}>
                                    {feature?.featureName}
                                </div>
                            ))}

                            <div className={`p-1 rounded-md m-1 w-full col-span-2 text-center cursor-pointer flex`}>
                                <input
                                    type="text"
                                    placeholder="Yeni Özellik"
                                    value={newFeatureName}
                                    onChange={(e) => setNewFeatureName(e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                />
                                <div
                                    className={`p-2 rounded-md border-1 flex items-center justify-center text-center cursor-pointer ml-2`}
                                    onClick={handleAddFeature}
                                >
                                    <span className='mr-1'>Ekle</span>
                                    <BsCheckCircle className={"w-5 h-5"}/>
                                </div>
                            </div>
                        </div>

                        {menuId &&
                            <Button
                                onClick={() => handleDeleteMenuProduct(productData.productId)}
                                className="ease-in-out duration-300 ml-1 flex items-center text-sm font-bold text-white hover:text-red-500 hover:bg-white hover:border-red-500 border-2 p-1.5 rounded-md bg-red-500">
                                <span className={"text-md "}>Menüden Sil</span>
                            </Button>
                        }
                    </div>
                </div>


            </div>
        </Modal>
    );
}

export default UpdateProduct;
