import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddStaffForm = ({ nextStep, companyId, branchId }) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const mutation = useMutation(newEmployee => {
        return axiosPrivate.post('/auth/register', newEmployee);
    });

    const validationSchema = Yup.object({
        firstName: Yup.string().required('İsim alanı zorunludur'),
        lastName: Yup.string().required('Soyisim alanı zorunludur'),
        phoneNumber: Yup.string()
            .matches(/^\d{10}$/, 'Telefon numarası 10 haneli olmalıdır')
            .required('Telefon numarası zorunludur'),
        email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta zorunludur'),
        password: Yup.string()
            .min(6, 'Parola en az 8 karakter olmalıdır')
            .required('Şifre zorunludur'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            role: 'STAFF',
            companyId: companyId,
            branchId: branchId
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values, {
                onSuccess: () => {
                    toast.success('Çalışan başarıyla eklendi');
                    queryClient.invalidateQueries(['staffs']);
                    formik.resetForm();
                    nextStep();
                },
                onError: (error) => {
                    toast.error(error.response?.data?.msg || "Çalışan kaydedilirken hata oluştu");
                    console.error(error);
                },
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">Çalışan Ekle</h2>

            <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">İsim</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.firstName && formik.errors.firstName ? <div className="text-red-500 text-sm">{formik.errors.firstName}</div> : null}
            </div>

            <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Soyisim</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.lastName && formik.errors.lastName ? <div className="text-red-500 text-sm">{formik.errors.lastName}</div> : null}
            </div>

            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
                <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div> : null}
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-sm">{formik.errors.email}</div> : null}
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Parola</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.password && formik.errors.password ? <div className="text-red-500 text-sm">{formik.errors.password}</div> : null}
            </div>

            <button
                type="submit"
                disabled={mutation.isLoading}
                className={`w-full px-4 py-2 rounded-md text-white ${mutation.isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700'}`}
            >
                {mutation.isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
        </form>
    );
};

export default AddStaffForm;
