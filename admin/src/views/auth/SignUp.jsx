import React from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "../../api/axios";
import {useMutation, useQueryClient} from "react-query";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../store/AuthSlice";
import {useNavigate, NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Formik için validasyon şeması
const signUpSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Ad alanı zorunludur'),
    lastName: Yup.string()
        .required('Soyad alanı zorunludur'),
    email: Yup.string()
        .email('Geçersiz e-posta adresi')
        .required('E-posta alanı zorunludur'),
    password: Yup.string()
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .required('Şifre alanı zorunludur'),
    phoneNumber: Yup.string()
        .required('Telefon numarası alanı zorunludur'),
});

export default function SignUpPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const mutation = useMutation(data => axios.post('/auth/register', data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries('userData');
            dispatch(loginSuccess(data.data));
            toast.success("Kullanıcı başarıyla oluşturuldu")
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response.data?.msg);
        },
    });

    return (
        <div className="mb-16 flex h-full w-full items-center justify-center px-2 h-dvh">
            <div className="mt-[10vh] w-full flex-col items-center max-w-[420px] bg-white p-4 shadow-lg rounded-lg">
                <h4 className="mb-4 text-2xl font-bold text-center text-navy-700 dark:text-white">
                    Kayıt Ol
                </h4>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        phoneNumber: '',
                    }}
                    validationSchema={signUpSchema}
                    onSubmit={(values) => {
                        mutation.mutate(values);
                    }}
                >
                    {({setFieldValue, isSubmitting}) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="firstName" className={`text-sm text-navy-700 dark:text-white ml-3 font-bold border-gray-200 dark:!border-white/10 `}>
                                    Adınız
                                </label>
                                <Field name="firstName"
                                       className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                                       placeholder="Adınız"/>
                                <ErrorMessage name="firstName" component="div" className="form-error"/>
                            </div>
                            <div>
                                <label htmlFor="firstName"
                                       className={`text-sm text-navy-700 dark:text-white ml-3 font-bold border-gray-200 dark:!border-white/10 `}>
                                    Soyadınız
                                </label>
                                <Field name="lastName"
                                       className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                                       placeholder="soyadınız"/>
                                <ErrorMessage name="lastName" component="div" className="form-error"/>
                            </div>
                            <div>
                                <label htmlFor="firstName"
                                       className={`text-sm text-navy-700 dark:text-white ml-3 font-bold border-gray-200 dark:!border-white/10 `}>
                                    email
                                </label>
                                <Field name="email"
                                       className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                                       placeholder="email"/>
                                <ErrorMessage name="email" component="div" className="form-error"/>
                            </div>
                            <div>
                                <label htmlFor="firstName"
                                       className={`text-sm text-navy-700 dark:text-white ml-3 font-bold border-gray-200 dark:!border-white/10 `}>
                                    Şifre
                                </label>
                                <Field name="password"
                                       className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                                       placeholder="En az 8 karakter"/>
                                <ErrorMessage name="password" component="div" className="form-error"/>
                            </div>
                            <div>
                                <label htmlFor="firstName"
                                       className={`text-sm text-navy-700 dark:text-white ml-3 font-bold border-gray-200 dark:!border-white/10 `}>
                                    Telefon Numaranız
                                </label>
                                <PhoneInput
                                    name="phoneNumber"
                                    placeholder="Telefon numaranız"
                                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                                    onChange={value => setFieldValue('phoneNumber', value, true)}
                                    defaultCountry={'TR'}
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="form-error"/>
                            </div>
                            <button
                                type="submit"
                                className={`mt-2 w-full rounded-xl py-[12px] text-base font-medium transition duration-200
                                    ${mutation.isLoading
                                    ? "bg-brand-300 text-white cursor-not-allowed"
                                    : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white"}
                                     `}
                                disabled={mutation.isLoading}
                            >
                                {mutation.isLoading ? "Bekleyiniz...":"Kayıt Ol"}
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="mt-4 text-center">
                <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
                    Zaten bir hesabınız var mı?
                </span>
                    <NavLink to={'/auth/sign-in'}
                             className="ml-1 text-sm text-brand-500 hover:text-brand-600 dark:text-white">
                        Giriş Yap
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
