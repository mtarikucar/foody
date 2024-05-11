import React, {useState} from "react";
import banner from "../../../../assets/img/profile/banner.png";
import Card from "../../../../components/card";
import PhotoUpload from "../../../../components/PhotoUpload";
import {useMutation, useQueryClient} from "react-query";
import {toast} from "react-toastify";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import {BsSliders} from "react-icons/bs";
import Dropdown from "../../../../components/dropdown";
import ChangePassword from "./ChangePassword";

const Banner = ({company}) => {

    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const handleFileDataChange = (newFileData) => {
        updateLogo.mutate(newFileData)
    };

    const updateLogo = useMutation(logo => {
        return axiosPrivate.put(`/company/${company.companyId}`, {logo: logo});
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("company")
            toast("sirketin logosu degistirildi")
        }
    });

    return (
        <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
            <div
                className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                style={{backgroundImage: `url(${banner})`}}
            >
                <div
                    className="absolute -bottom-12 flex  items-center justify-center rounded-full border-[4px] border-white ">
                    {company && company.logo ?
                        <img src={company.logo} className={"rounded-full w-24 h-24"} alt=""/> :
                        <PhotoUpload onFileDataChange={handleFileDataChange} multiImage={false} size={24}/>
                    }
                </div>
            </div>

            {/* Name and position */}
            <div className="mt-16 flex flex-col items-center">
                <div className={"flex justify-center items-center"}>

                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                        {company?.name}
                    </h4>
                    <Dropdown
                        button={
                            <p className="cursor-pointer">
                                <BsSliders className="h-4 w-4 text-gray-900 dark:text-white ml-2"/>
                            </p>
                        }

                        children={
                            <div
                                className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                                <ChangePassword/>
                            </div>
                        }
                        classNames={"py-2 top-4  w-max "}
                    />
                </div>

                <p className="text-base font-normal text-gray-600">{company?.companyId}</p>
            </div>


        </Card>
    );
};

export default Banner;
