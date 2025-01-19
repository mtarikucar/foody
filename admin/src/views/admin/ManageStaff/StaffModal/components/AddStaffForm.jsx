import {useMutation, useQueryClient} from 'react-query';
import { useState } from 'react';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import {toast} from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";

const AddStaffForm = ({nextStep, companyId,branchId}) => {


    const axiosPrivate = useAxiosPrivate(); // Use your custom axios hook with authentication
    const queryClient = useQueryClient();


    const mutation = useMutation(newEmployee => {
        return axiosPrivate.post('/auth/register', newEmployee); // Replace with your API endpoint
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        role: 'STAFF',
        companyId: companyId,
        branchId: branchId
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate(formData, {
            onSuccess: () => {
                toast.success('Çalışan başarıyla eklendi');
                queryClient.invalidateQueries(['staffs']);
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email: '',
                    password: '',
                    role: 'STAFF',
                    companyId: companyId,
                    branchId: branchId
                });
                nextStep();
            },
            onError: (error) => {
                // Handle the error scenario
                toast.error('Bir hata oluştu: ' + error.response?.data?.message || error.message);
                console.error(error);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">Çalışan Ekle </h2>
            <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">İsim</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Soyisim</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefon
                    Numarası</label>
                <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber}
                       onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Parola</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <button
                type="submit"
                disabled={mutation.isLoading}
                className={`w-full px-4 py-2 rounded-md focus:outline-none ${mutation.isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700'} text-white`}
            >
                {mutation.isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
        </form>


    );
};


export default AddStaffForm
