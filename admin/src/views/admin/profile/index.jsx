import Banner from "./components/Banner";
import General from "./components/General";
import {useQuery} from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import ChangePassword from "./components/ChangePassword";
import React, {useState} from "react";
import Card from "../../../components/card";
import Branches from "./components/branches";
import Package from "./components/package";


const ProfileOverview = () => {

    const axiosPrivate = useAxiosPrivate()
    const auth = useAuth()

    const {data: company, isLoading, error} = useQuery('company', async () => {
        const response = await axiosPrivate.get(`/company/${auth.companyId}`);
        return response.data.data;
    });

    return (
        <div className="flex w-full flex-col gap-5">

            <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">

                <div className={`${auth.package ? "col-span-12" : "col-span-8"} lg:!mb-0`}>
                    <Banner company={company}/>
                </div>
              {/*  <div className="col-span-4 lg:!mb-0">
                    <Package/>
                </div>*/}


            </div>

        </div>
    );
};

export default ProfileOverview;
