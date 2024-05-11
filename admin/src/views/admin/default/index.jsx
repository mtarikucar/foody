import {IoMdHome} from "react-icons/io";
import {IoDocuments} from "react-icons/io5";
import {MdBarChart, MdDashboard} from "react-icons/md";
import mainPicture from "../../../assets/img/dashboards/main.png";

import Widget from "../../../components/widget/Widget";
import Upload from "../branch/components/Upload";
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

    ;
    const {data: branch, isLoading, error} = useQuery('branch', async () => {
        const response = await axiosPrivate.get(`/branch/${auth.branchId}`);
        return response.data.data;
    });

    return (
        <div>
            {/* Card widget */}
            {/*  <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                <Widget
                    icon={<MdBarChart className="h-7 w-7"/>}
                    title={"Earnings"}
                    subtitle={"$340.5"}
                />
                <Widget
                    icon={<IoDocuments className="h-6 w-6 branch-joyride"/>}
                    title={"Spend this month"}
                    subtitle={"$642.39"}
                />
                <Widget
                    icon={<MdBarChart className="h-7 w-7"/>}
                    title={"Sales"}
                    subtitle={"$574.34"}
                />
                <Widget
                    icon={<MdDashboard className="h-6 w-6"/>}
                    title={"Your Balance"}
                    subtitle={"$1,000"}
                />
                <Widget
                    icon={<MdBarChart className="h-7 w-7"/>}
                    title={"New Tasks"}
                    subtitle={"145"}
                />
                <Widget
                    icon={<IoMdHome className="h-6 w-6 start-joyride"/>}
                    title={"sistemi bastan tanimak mi istiyorun?"}
                    subtitle={"gezinyiye basla"}
                />
            </div>*/}
            <div className="mt-3  flex-col items-center grid grid-cols-12 gap-2">
                <div className={"col-span-10"}>
                    <Package/>
                </div>

                {(!requirementComplate && branch) &&

                    <div className={"col-span-2 "}>
                        <Upload branch={branch} isRender={(e) => isRender(e)}/>
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
