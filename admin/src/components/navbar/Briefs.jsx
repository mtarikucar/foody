// Notifications.js
import React, {useEffect,useState} from "react";
import { useQuery, useQueryClient } from "react-query";
import {IoMdInformation, IoMdInformationCircleOutline, IoMdNotificationsOutline} from "react-icons/io";
import { BsArrowBarUp } from "react-icons/bs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Dropdown from "../dropdown";
import {useWebSocket} from "../../context/socket/WebSocketContext";
import Package from "../../views/admin/profile/components/package";
import Requirements from "../../views/admin/branch/components/Upload";

const Breifs = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const [receivedData, setReceivedData] = useState([]);
    const socket = useWebSocket();

    useEffect(() => {
        if (socket) {
            socket.subscribe("/topic/notification/" + auth.currentUser, (message) => {
                setReceivedData((receivedData) => [
                    ...receivedData,
                    JSON.parse(message.body),
                ]);
            });
        }

        return () => {
            socket?.unsubscribe("/topic/notification/" + auth.currentUser);
        };
    }, [socket]);

    const { data: notification } = useQuery("notification", async () => {
        const response = await axiosPrivate.get(
            `/notification?userId=${auth.currentUser}`
        );
        return response.data.data;
    });


    const [requirementComplate, isRender] = useState(false);
    const {data: branch, isLoading, error} = useQuery('branch', async () => {
        const response = await axiosPrivate.get(`/branch/${auth.branchId}`);
        return response.data.data;
    });
    useEffect(() => {
        queryClient.invalidateQueries("notification");
    }, [receivedData]);

    return (
        <Dropdown
            button={
                <p className="cursor-pointer animate-bounce">
                    <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
                </p>
            }
            children={
                <div className="flex w-[280px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px] max-h-[50vh] overflow-y-scroll sm:absolute sm:left-0 sm:translate-x-0 translate-x-[-100%]">
                    {(!requirementComplate && branch) &&

                        <div className={" col-span-6 "}>
                            <Requirements branch={branch} isRender={(e) => isRender(e)}/>
                        </div>
                    }
                    <div className={"col-span-6 h-full"}>
                        <Package/>
                    </div>
                </div>
            }
            classNames={"py-2 top-4 w-max"}
        />
    );
};

export default Breifs;
