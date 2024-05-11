import { useMutation } from 'react-query';
import { useState } from 'react';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";

const AddStaffForm = ({nextStep, companyId}) => {


    const axiosPrivate = useAxiosPrivate(); // Use your custom axios hook with authentication


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
        companyId: companyId
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate(formData, {
            onSuccess: () => {
                // Handle success scenario, maybe navigate to another page or show a message
                nextStep();
            },
            onError: (error) => {
                // Handle the error scenario
                console.error(error);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 shadow-md grid grid-cols-2 gap-4 ">
            <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber}
                       onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="mb-6 col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <button type="submit"
                    className="col-span-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Save
            </button>
        </form>

    );
};


export default AddStaffForm
