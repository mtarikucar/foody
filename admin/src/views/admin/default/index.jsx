import {IoMdHome} from "react-icons/io";
import {IoDocuments} from "react-icons/io5";
import {MdBarChart, MdDashboard} from "react-icons/md";
import mainPicture from "../../../assets/img/dashboards/main.png";

import Widget from "../../../components/widget/Widget";
import Requirements from "../branch/components/Upload";
import React, {useState} from "react";
import {useQuery} from "react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Package from "../profile/components/package";
import Branches from "../profile/components/branches";

const Dashboard = () => {

    const auth = useAuth();
    const axiosPrivate = useAxiosPrivate()

    const [requirementComplate, isRender] = useState(false);
    const {data: branch, isLoading, error} = useQuery('branch', async () => {
        const response = await axiosPrivate.get(`/branch/${auth.branchId}`);
        return response.data.data;
    });

    return (
        <div>

            <div className="mt-3  flex-col items-center grid grid-cols-12  gap-2">
                <div className={"col-span-6 h-full"}>
                    <Package/>
                </div>
                {(!requirementComplate && branch) &&

                    <div className={" col-span-6 "}>
                        <Requirements branch={branch} isRender={(e) => isRender(e)}/>
                    </div>
                }
            </div>


            <div className={"col-span-12"}>

                <Branches/>

            </div>
        </div>
    );
};

export default Dashboard;
