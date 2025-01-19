import {useQuery} from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useParams} from "react-router-dom";

import React, {useState} from "react";


import AddStaffForm from "./StaffModal/components/AddStaffForm";
import StaffList from "./StaffModal/components/StaffList";
import useAuth from "../../../hooks/useAuth";
import Spinner from "../../../components/Spinner/Spinner";

const SuccessMessage = ({resetForm}) => (
    <div className="max-w-md mx-auto mt-10 p-6 bg-green-100 border border-green-300 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-green-800">Employee Added Successfully</h2>
        <button onClick={resetForm}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50">
            Add Another Employee
        </button>
    </div>
);


const ManageStaff = () => {

    const axiosPrivate = useAxiosPrivate()

    const {id} = useParams()

    const {data: branch, isLoading, error} = useQuery('branch', async () => {
        const response = await axiosPrivate.get(`/branch/${id}`);
        return response.data.data;
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const auth = useAuth();


    const nextStep = () => setCurrentStep(prev => prev + 1);
    const resetForm = () => {
        setCurrentStep(0);
        setOpenForm(false);
    };

    if (isLoading) return <Spinner loading={true} size={60} />;
    if (error) return <div>An error occurred</div>;
    return (

        <div className="flex w-full flex-col gap-5 mt-5">


            {openForm ?

                <div>
                    {currentStep == 0 &&
                        <>
                            <button className="add-employee-button mb-4" onClick={() => setOpenForm(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                                </svg>

                            </button>

                        </>
                    }
                    {currentStep == 1 && <SuccessMessage resetForm={resetForm}/>
                    }
                </div>

                :
                <div className="grid grid-cols-6 h-full gap-2 min-w-[80vh]">
                    <div className={"col-span-4"}>
                        <StaffList/>
                    </div>
                    <div className={"col-span-2 h-dvh bg-white shadow rounded-lg p-4"}>
                    <AddStaffForm nextStep={nextStep} companyId={auth?.companyId} branchId={auth?.branchId}/>
                    </div>
                </div>
            }
        </div>
    );
};

export default ManageStaff;


