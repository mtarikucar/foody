import React, {useState} from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import uploadFileToFirebase from "../../../firebase/uploadFileToFirebase";
import {useSelector} from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import {toast} from "react-toastify";
import PhotoUpload from "../../../../components/PhotoUpload";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

// Form doğrulama şeması
const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
});

const AddCategory = () => {
    const [fileData, setFileData] = useState();
    const auth = useAuth()
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient()
    const [devam, setDevam] = useState(false)

    const {mutate} = useMutation(data => axiosPrivate.post('/category', data), {
        onSuccess: (data) => {
            toast("kategori basariyla yuklendi")
            queryClient.invalidateQueries("categories")
            setDevam(false)
        },
        onError: () => {
            toast.error("kategori eklenirken bir sorun olustu")
            setDevam(false)
        }
    });


    const handleSubmit = async (values) => {
        setDevam(true)
        try {
            const dataToSend = {
                ...values,
                image: fileData,
                companyId: auth.companyId
            };

            mutate(dataToSend);
        } catch (error) {
            console.error('Hata:', error);
        }
    };


    return (
        <div className='col-span-2 lg:col-span-1 p-4 shadow-lg border-gray-300 rounded-lg bg-white overflow-auto mt-4'>
          {/*  <div className={}>

            </div>*/}
            <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={ProductSchema}
                onSubmit={handleSubmit}
            >
                {({errors, touched}) => (
                    <Form className='space-y-4'>
                        <PhotoUpload size={32} multiImage={false} onFileDataChange={(file) => {
                            setFileData(file)
                        }}/>
                        <Field name="name" placeholder="Name" className='w-full p-2 border rounded-md'/>
                        {errors.name && touched.name ? (<div>{errors.name}</div>) : null}

                        <button type="submit"
                                disabled={devam}
                                className={`bg-gray-50  col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${devam && "bg-indigo-300"}`}>
                            {
                                devam ? "Yükleniyor..." : "kaydet"
                            }
                        </button>
                    </Form>
                )}
            </Formik>

        </div>
    );
};

export default AddCategory;
