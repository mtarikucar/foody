import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import uploadFileToFirebase from "../../../firebase/uploadFileToFirebase";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";
import Switch from "../../../../components/switch";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { BsPlusSquare, BsXSquare, BsCheckCircle } from "react-icons/bs";

const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Zorunlu'),
    price: Yup.number().required('Zorunlu').positive('Fiyat pozitif olmalı'),
    ratings: Yup.number().required('Zorunlu').min(0).max(5),
    categoryId: Yup.string().required('Zorunlu'),
    description: Yup.string().required('Açıklama zorunlu')
});

const AddProduct = () => {
    const [fileData, setFileData] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const auth = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const [wait, setWait] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [newFeatureName, setNewFeatureName] = useState('');
    const [selectedMenu, setSelectedMenu] = useState("");
    const [isMenu, setIsMenu] = useState(true);
    const [addFeature, setAddFeature] = useState(false);

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
        addFeatureMutation.mutate({ name: newFeatureName.trim(), companyId: auth.companyId });
    };

    const { mutate } = useMutation(data => axiosPrivate.post('/product', data), {
        onSuccess: (response) => {
            isMenu && selectedMenu !== "" && menuMutate([response?.data?.data?.productId]);
            toast("Ürün başarıyla yüklendi");
            queryClient.invalidateQueries("products");
            setWait(false);
        },
        onError: (error) => {
            console.error("Hata:", error);
            toast.error("Ürün yüklenirken bir sorun oluştu");
            setWait(false);
        },
    });

    const { mutate: menuMutate } = useMutation(data => axiosPrivate.post(`/menu/${selectedMenu}/products`, data), {
        onSuccess: () => {
            toast.success("Ürün başarıyla menüye eklendi");
            queryClient.invalidateQueries('products');
        },
        onError: (error) => {
            toast.error("Ürün menüye eklenirken hata oluştu");
        }
    });

    const { data: categories } = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data;
    });

    const { data: features, isSuccess } = useQuery('features', async () => {
        try {
            const response = await axiosPrivate.get(`/product/features?companyId=${auth.companyId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    });

    const { data: menus, isSuccessMenu } = useQuery('menus', async () => {
        try {
            const response = await axiosPrivate.get(`/menu?companyId=${auth.companyId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalFiles = fileData.length + selectedFiles.length;

        if (totalFiles > 3) {
            alert('En fazla 3 fotoğraf yükleyebilirsiniz.');
        } else {
            setFileData([...fileData, ...selectedFiles]);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setFileData(fileData.filter((_, index) => index !== indexToRemove));
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

    const handleSubmit = async (values) => {
        try {
            setWait(true);
            const imageUrls = await Promise.all(
                fileData.map(file => uploadFileToFirebase(file))
            );
            const dataToSend = {
                ...values,
                images: imageUrls,
                companyId: auth.companyId,
                featureIds: selectedFeatures
            };
            mutate(dataToSend);
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    return (
        <div className='col-span-2 lg:col-span-1 p-4 shadow-lg rounded-lg bg-white overflow-auto'>
            <Formik
                initialValues={{
                    name: '',
                    price: null,
                    ratings: null,
                    categoryId: '',
                    description: ''
                }}
                validationSchema={ProductSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isValid, dirty }) => (
                    <Form className='grid grid-cols-2 gap-3'>
                        {isMenu &&
                            <select
                                placeholder={"Bir Menü Seç"}
                                onChange={event => setSelectedMenu(event.target.value)}
                                id="menus"
                                className="bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value={""} selected>Menü Seç</option>
                                {menus?.data?.map(menu => (
                                    <option key={menu.menuId} value={menu.menuId}>
                                        {menu.menuName}
                                    </option>
                                ))}
                            </select>
                        }
                        <div className={"col-span-2 flex justify-start items-center mb-2"}>
                            <Switch onClick={() => setIsMenu(!isMenu)} />
                            <span className={"ml-2 text-sm text-gray-900"}>Eklenecek ürünleri henüz menüde göstermek istemiyorum.</span>
                        </div>
                        <div>
                            <Field as="select" name="categoryId"
                                   className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                                <option value="">Kategori Seç</option>
                                {categories?.data?.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </Field>
                            {errors.categoryId && touched.categoryId ? (<div>{errors.categoryId}</div>) : null}
                        </div>
                        <div>
                            <Field name="name" placeholder="Ürün Adı"
                                   className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                            {errors.name && touched.name ? (<div>{errors.name}</div>) : null}
                        </div>
                        <div>
                            <Field name="price" type="number" placeholder="Fiyat"
                                   className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                            {errors.price && touched.price ? (<div>{errors.price}</div>) : null}
                        </div>
                        <div>
                            <Field name="ratings" type="number" placeholder="Değerlendirme"
                                   className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                            {errors.ratings && touched.ratings ? (<div>{errors.ratings}</div>) : null}
                        </div>
                        <div className={"col-span-2"}>
                            <Field
                                as="textarea"
                                name="description"
                                placeholder="Açıklama"
                                className='bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                            />
                            {errors.description && touched.description ? (<div>{errors.description}</div>) : null}
                        </div>
                        <div className="col-span-2 grid grid-cols-9  border border-gray-300 rounded-md">
                            {(isSuccess && features?.data?.length > 0 ? features.data : []).map(feature => (
                                <div
                                    key={feature?.featureId}
                                    className={`p-2 rounded-md m-2 text-center flex items-center justify-center cursor-pointer ${selectedFeatures.includes(feature?.featureId) ? 'bg-indigo-700 text-white' : 'bg-gray-300'}`}
                                    onClick={() => handleFeatureClick(feature?.featureId)}>
                                    {feature?.featureName}
                                </div>
                            ))}

                            <div className={`p-1 rounded-md col-span-2 m-1 text-center cursor-pointer flex`}>
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
                                    <span className = 'mr-1'>Ekle</span >
                                    <BsCheckCircle className={"w-5 h-5"} />
                                </div>
                            </div>

                        </div>
                        <div className={'col-span-2'}>
                            <div className="flex flex-col">
                                <label htmlFor="file-upload" className="ml-2 mb-2 text-sm font-medium text-gray-700">
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
                            <button type="submit"
                                    disabled={!(isValid && dirty) || wait}
                                    className={`w-full p-2 mt-3 rounded-md text-white ${wait ? "bg-indigo-500" : "bg-indigo-700 hover:-translate-y-1 ease-in-out duration-200"}`}>
                                {wait ? "Yükleniyor..." : "Ekle"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div className='grid grid-cols-4 gap-4 mt-4'>
                {fileData.map((file, index) => (
                    <div
                        key={index}
                        className="relative"
                        onMouseEnter={() => setHoveredImage(index)}
                        onMouseLeave={() => setHoveredImage(null)}
                    >
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Ürün"
                            className='w-20 h-20 object-cover rounded-md'
                        />
                        {hoveredImage === index && (
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-1/4 bg-red-500 text-white px-2 rounded-full"
                            >
                                &#10005;
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddProduct;
