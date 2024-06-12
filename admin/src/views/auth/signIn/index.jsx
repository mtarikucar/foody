import React, {useState} from 'react';
import {useMutation, useQueryClient} from "react-query";
import axios from "../../../api/axios";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../../store/AuthSlice";
import {toast} from "react-toastify";
import {
    FaEye, FaEyeSlash
} from "react-icons/fa";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import MailFbModal from "./components/MailFbModal";


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email gereklidir')
        .email('Geçerli bir email adresi giriniz'),
    password: Yup.string()
        .required('Şifre gereklidir')
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .matches(/[a-zA-Z]/, 'Şifre harf içermelidir')
        .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
        .matches(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
        .matches(/\d/, 'Şifre en az bir rakam içermelidir')
        .matches(/[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~`]/, 'Şifre en az bir özel karakter içermelidir'),
});

export default function SignInPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [forgotModal, setForgotModal] = useState(false);


    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const signIn = async ({email, password}) => {
        const response = await axios.post('/auth/authenticate', {
            email, password,
        });
        return response.data;
    };

    const mutation = useMutation(signIn, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('userData');
            dispatch(loginSuccess(data.data));
            navigate("/");
            toast.success("Giriş başarılı")
        }, onError: (error) => {
            toast.error(error.response.data?.msg);
        },
    });

    const handleSubmit = (values) => {
        mutation.mutate(values);
    };


    return (

        <div className="mb-16 flex  w-full items-center justify-center px-2 ">
            <div className="mt-[10vh] w-full flex-col items-center max-w-[420px] ">
                <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                    Giriş Yap
                </h4>
                <p className="mb-9 ml-1 text-base text-gray-600">
                    Giriş yapmak için email ve şifrenizi giriniz!
                </p>
                <Formik
                    initialValues={{
                        email: '', password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, errors, touched}) => (<>
                        <MailFbModal isOpen={forgotModal} onClose={() => setForgotModal(!forgotModal)}
                                     email={values.email}/>
                        <Form className="space-y-4 relative ">
                            <Field name="email" type="email" placeholder="Email"
                                   className="w-full rounded-md p-2 text-black border-2"/>
                            {errors.email && touched.email ? <div>{errors.email}</div> : null}

                            <div className="relative w-full">
                                <Field name="password" type={showPassword ? "text" : "password"} placeholder="Şifre"
                                       className="w-full rounded-md p-2 text-black border-2"/>
                                <span onClick={togglePasswordVisibility}
                                      className="absolute top-3 right-3 flex items-center cursor-pointer text-lg">
                                    {showPassword ? <FaEye/> : <FaEyeSlash/>}
                                </span>
                            </div>
                            {errors.password && touched.password ? <div>{errors.password}</div> : null}
                            <div onClick={() => setForgotModal(true)}
                                 className="cursor-pointer text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
                                Şifreni mi unuttun?
                            </div>
                            <button
                                type="submit"
                                className={`mt-2 w-full rounded-xl py-[8px] text-base font-medium transition duration-200
                                    ${mutation.isLoading ? "bg-brand-300 text-white cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"}
                                     `}
                                disabled={mutation.isLoading}
                            >
                                {mutation.isLoading ? "Bekleyiniz..." : "Giriş Yap"}
                            </button>
                        </Form>
                    </>)}
                </Formik>
                <div className="mt-4">
                    <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
                        Henüz bir hesabınız yok mu?
                    </span>
                    <NavLink
                        to={'/auth/sign-up'}
                        className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                    >
                        Kayıt Ol
                    </NavLink>
                </div>
            </div>
        </div>

    );
}
