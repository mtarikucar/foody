import Card from "../../../../components/card";
import React, {useState} from "react";
import nft1 from "../../../../assets/img/nfts/NftBanner1.png";
import {motion} from "framer-motion";
import ColorPickerComponent from "../../../../components/ColorPickerComponent";
import useAuth from "../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import {useMutation, useQueryClient} from "react-query";
import {toast} from "react-toastify";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import {logoutSuccess} from "../../../../store/AuthSlice";
import {useDispatch} from "react-redux";


const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Mevcut şifre gereklidir'),
    newPassword: Yup.string().required('Yeni şifre gereklidir'),
    confirmationPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmelidir')
        .required('Şifre tekrarı gereklidir'),
});
const ChangePassword = () => {
    const [wait, setWait] = useState(false)
    const auth = useAuth();
    const dispatch =useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const changePasswordMutation  = useMutation(
        (passwordData) => axiosPrivate.put('/users', passwordData),
        {
            onSuccess: () => {
                //queryClient.invalidateQueries("menus");
                setWait(false)
                dispatch(logoutSuccess())
                toast.info("sifre degistirildi, tekrardan giriş yapın. ");
            },
            onError: (error) => {
                setWait(false)
                toast.error("birseyler yanlis gitti");
            },
        }
    );


    const handleSubmit = (values) => {
        setWait(true);
        console.log(values);
        changePasswordMutation.mutate(values)
    };
    return (
        <Card extra={"w-full h-full p-3"} >
            <header>
                <h2 className="text-2xl text-center font-semibold">Şifre Değiştir</h2>
            </header>
            <div className="flex w-full flex-col rounded-2xl  px-8 py-8  md:px-16 md:py-14">

                        <div>
                            <Formik
                                initialValues={{
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmationPassword: '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form className="space-y-4  ">
                                        <Field name="currentPassword" type="password" placeholder="Eski şifre" className="w-full rounded-md p-2 text-black border-2" />
                                        {errors.currentPassword && touched.currentPassword ? <div>{errors.currentPassword}</div> : null}

                                        <Field name="newPassword" type="password" placeholder="Yeni Şifre" className="w-full rounded-md p-2 text-black border-2" />
                                        {errors.newPassword && touched.newPassword ? <div>{errors.newPassword}</div> : null}

                                        <Field name="confirmationPassword" type="password" placeholder="Yeni Şifreyi doğrula" className="w-full rounded-md p-2 text-black border-2" />
                                        {errors.confirmationPassword && touched.confirmationPassword ? <div>{errors.confirmationPassword}</div> : null}

                                        <button type="submit"
                                                disabled={wait}
                                                className={`w-full p-2 bg-indigo-500 hover:-translate-y-1 ease-in-out duration-200 text-white rounded-md ${wait && "bg-indigo-300"}`}>
                                            {wait ? "Yükleniyor..." : "kaydet"}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                </div>
            </div>
        </Card>
    );
};

export default ChangePassword;
