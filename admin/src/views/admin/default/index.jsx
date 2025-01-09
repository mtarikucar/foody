
import React, {useState} from "react";
import useAuth from "../../../hooks/useAuth";
import Branches from "../profile/components/branches";
const Dashboard = () => {

    const auth = useAuth();


    return (
        <div>

            <div className="mt-3  flex-col items-center grid grid-cols-12  gap-2">

            </div>


            <div className={"col-span-12"}>

                <Branches/>

            </div>
        </div>
    );
};

export default Dashboard;
