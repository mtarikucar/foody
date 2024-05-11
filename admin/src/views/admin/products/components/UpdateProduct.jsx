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

    useEffect(() => {
        if (productData?.images) {
            setImageUrls(productData.images);
            setFileData([])
        }
    }, [productData]);

    const {data: categories} = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data;
    });

    const {mutate} = useMutation(
        updatedData => axiosPrivate.put(`/product/${productData.productId}`, updatedData),
        {
            onSuccess: () => {
                setFileData([])
                toast("Ürün başarıyla güncellendi.");
                queryClient.invalidateQueries("products")
                onClose()
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
        setImageUrls(imageUrls.filter(image => image !== imageToRemove));
    };

    const handleRemoveImage = (indexToRemove) => {
        setFileData(fileData.filter((_, index) => index !== indexToRemove));
    };

    const handleDelete = (id) => {
        setDeleteOpen(true)
        setDeleteId(id)

    };

    const handleDeleteMenuProduct = (id) => {
        setDeleteMenuProduct(true)
        setMenuProductId(id)
        console.log(id)
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
                images: allImages
            };

            // API çağrısı yap (mutate kullanılıyorsa)
            mutate(dataToSend);
        } catch (error) {
            console.error('Hata:', error);
            toast.error("Bir hata oluştu.");
        }
    };

    return (
        <Modal title={'urun-menu'} description={"menuyu ekleyebillecegin urunler"} size="extraLarge" isOpen={isOpen}
               onClose={onClose}>

            <DeleteProduct isOpen={deleteOpen} onClose={deleteProductModal} id={deleteId}/>
            <DeleteProductFromMenu isOpen={deleteMenuProduct} onClose={deleteMenuProductModal} id={menuProductId}
                                   menuId={menuId}/>

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
                        {({errors, touched}) => (

                            <Form className='space-y-4'>
                                <Field name="name" placeholder="Name"
                                       className='bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.name && touched.name ? <div>{errors.name}</div> : null}

                                <Field name="price" type="number" placeholder="Price"
                                       className='bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.price && touched.price ? <div>{errors.price}</div> : null}

                                <Field name="ratings" type="number" placeholder="Ratings"
                                       className='bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.ratings && touched.ratings ? <div>{errors.ratings}</div> : null}

                                <Field as="select" name="categoryId"
                                       className='bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                                    <option value="">Change category</option>
                                    {categories?.data?.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                {errors.categoryId && touched.categoryId ? <div>{errors.categoryId}</div> : null}

                                <Field as="textarea" name="description" placeholder="Description"
                                       className='bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
                                {errors.description && touched.description ? <div>{errors.description}</div> : null}

                                <input type="file" multiple onChange={handleFileChange}
                                       className='file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100' disabled={fileData.length >= 3}/>

                                <button type="submit"
                                        className='w-full p-2 bg-indigo-700 hover:-translate-y-1 ease-in-out duration-200 text-white rounded-md'>
                                    Kaydet
                                </button>
                                <Button
                                    onClick={() => handleDelete(productData.productId)}
                                    className="w-full p-2 bg-red-600 hover:-translate-y-1 ease-in-out duration-200 text-white rounded-md">
                                    <span className={"text-md "}>Sil</span>
                                </Button>
                            </Form>

                        )}
                    </Formik>

                    <div className={" "}>
                        <div className='grid grid-cols-4 p-1 gap-1  border-2 rounded-md'>

                            {productData?.images?.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setHoveredImage(index)}
                                    onMouseLeave={() => setHoveredImage(null)}
                                >
                                    <img
                                        src={image}
                                        alt="Product"
                                        className='w-20 h-20 border-2 object-cover rounded-md'
                                    />
                                    {hoveredImage === index && (
                                        <button
                                            onClick={() => handleRemoveImages(image)}
                                            className="absolute top-0   bg-red-500 text-white px-2 rounded-full"
                                        >
                                            &#10005; {/* Bu, bir çarpı işaretidir */}
                                        </button>
                                    )}
                                </div>
                            ))}

                            {fileData.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setHoveredImage(index)}
                                    onMouseLeave={() => setHoveredImage(null)}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Product"
                                        className='w-20 h-20 border-2 object-cover rounded-md'
                                    />
                                    {hoveredImage === index && (
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0  bg-red-500 text-white px-2 rounded-full"
                                        >
                                            &#10005; {/* Bu, bir çarpı işaretidir */}
                                        </button>
                                    )}
                                </div>
                            ))}
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
