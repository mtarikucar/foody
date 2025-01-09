import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "../../api/axios";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/AuthSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Form validation schema
const signUpSchema = Yup.object().shape({
    firstName: Yup.string().required('Ad alanı zorunludur'),
    lastName: Yup.string().required('Soyad alanı zorunludur'),
    email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta alanı zorunludur'),
    password: Yup.string()
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .required('Şifre alanı zorunludur'),
    phoneNumber: Yup.string().required('Telefon numarası alanı zorunludur'),
});

export default function SignUpPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (data) => axios.post('/auth/register', data),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('userData');
                dispatch(loginSuccess(data.data));
                toast.success("Kullanıcı başarıyla oluşturuldu");
                navigate("/");
            },
            onError: (error) => {
                toast.error(error.response.data?.msg);
            },
        }
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4 ">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg">
                <h4 className="mb-6 text-3xl font-bold text-center text-navy-700 dark:text-white">Kayıt Ol</h4>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        phoneNumber: '',
                    }}
                    validationSchema={signUpSchema}
                    onSubmit={(values) => mutation.mutate(values)}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Adınız
                                </label>
                                <Field
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Adınız"
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="firstName" component="div" className="text-sm text-red-500 mt-1" />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Soyadınız
                                </label>
                                <Field
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Soyadınız"
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="lastName" component="div" className="text-sm text-red-500 mt-1" />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    E-posta
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    placeholder="E-posta adresiniz"
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
                            </div>

                            {/* Password */}
                            <div className="md:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Şifre
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Şifrenizi girin"
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
                            </div>

                            {/* Phone Number */}
                            <div className="md:col-span-2">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Telefon Numaranız
                                </label>
                                <PhoneInput
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Telefon numaranız"
                                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onChange={(value) => setFieldValue('phoneNumber', value)}
                                    defaultCountry="TR"
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="text-sm text-red-500 mt-1" />
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={mutation.isLoading || isSubmitting}
                                    className={`w-full py-3 rounded-lg text-white font-medium transition ${
                                        mutation.isLoading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                                    }`}
                                >
                                    {mutation.isLoading ? "Bekleyiniz..." : "Kayıt Ol"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* Footer */}
                <div className="mt-6 text-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Zaten bir hesabınız var mı?
          </span>
                    <NavLink
                        to="/auth/sign-in"
                        className="ml-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        Giriş Yap
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
