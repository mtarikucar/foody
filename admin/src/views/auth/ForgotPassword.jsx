import React, {useState} from 'react'; // useState'i import ediyoruz
import {useMutation} from "react-query";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import axios from "../../api/axios";
import {Field, Form, Formik} from "formik";
import {logoutSuccess} from "../../store/AuthSlice";
import * as Yup from "yup";


const variants = {
    open: {opacity: 1, height: "auto", display: "block"},
    closed: {opacity: 0, height: 0, display: "none"}
};

const validationSchema = Yup.object().shape({
    email: Yup.string().required('email gereklidir'),
    newPassword: Yup.string().required('Yeni şifre gereklidir'),
    confirmationPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmelidir')
        .required('Şifre tekrarı gereklidir'),
});


export default function ForgotPassword() {

    const {id} = useParams();

    const [wait, setWait] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const changePasswordMutation = useMutation(
        (passwordData) => axios.post('/verifyOtp', {...passwordData, otp: id}),
        {
            onSuccess: () => {
                setWait(false)
                dispatch(logoutSuccess())
                toast.info("sifre degistirildi, tekrardan giriş yapın. ");
                navigate("/auth/sign-in")
            },
            onError: (error) => {
                setWait(false)
                toast.error("birseyler yanlis gitti");
            },
        }
    );


    const handleSubmit = (values) => {
        setWait(true);
        changePasswordMutation.mutate(values)
    };
    return (
        <div className="mb-16 flex h-full w-full items-center justify-center px-2 min-h-screen">

            <div className="flex w-full flex-col rounded-2xl  px-8 py-8 md:px-16 md:py-14">

                <div>
                    <Formik
                        initialValues={{
                            email: '',
                            newPassword: '',
                            confirmationPassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched}) => (
                            <Form className="space-y-4  ">


                                <Field name="email" type="email" placeholder="Email adresi"
                                       className="w-full rounded-md p-2 text-black border-2"/>
                                {errors.email && touched.email ? <div>{errors.email}</div> : null}

                                <Field name="newPassword" type="password" placeholder="Yeni Şifre"
                                       className="w-full rounded-md p-2 text-black border-2"/>
                                {errors.newPassword && touched.newPassword ? <div>{errors.newPassword}</div> : null}

                                <Field name="confirmationPassword" type="password"
                                       placeholder="Yeni Şifreyi doğrula"
                                       className="w-full rounded-md p-2 text-black border-2"/>
                                {errors.confirmationPassword && touched.confirmationPassword ?
                                    <div>{errors.confirmationPassword}</div> : null}

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

        </div>
    );
}
