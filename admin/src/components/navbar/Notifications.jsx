// Notifications.js
import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {IoMdNotificationsOutline} from "react-icons/io";
import {BsArrowBarUp} from "react-icons/bs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Dropdown from "../dropdown";
import {useWebSocket} from "../../context/socket/WebSocketContext";

const Notifications = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const [isUnreadExist, setIsUnreadExist] = useState(true)

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

    const {data: notification} = useQuery("notification", async () => {
        const response = await axiosPrivate.get(
            `/notification?userId=${auth.currentUser}`
        );
        return response.data.data;
    });


    const mutation = useMutation(async (data) => {
        const response = await axiosPrivate.post('/notification/mark-as-read?notificationId=' + data);
        return response.data;
    }, {
        onSuccess: (response) => {
            queryClient.invalidateQueries("notification");
        },
        onError: (error) => {
            console.error('Error submitting data:', error);
        },
    });


    useEffect(() => {
        queryClient.invalidateQueries("notification");
    }, [receivedData]);

    useEffect(() => {
        if (notification) {
            setIsUnreadExist(notification.some((item) => !item.read));
        }
    },[notification]);

    return (
        <Dropdown
            button={
                <p className="cursor-pointer relative">
                    {isUnreadExist && (
                        <div
                            className={"flex justify-center items-center h-2 w-2 bg-brand-500 rounded-full absolute top-0 right-0  animate-pulse"}>
                        </div>
                    )}
                    <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white"/>
                </p>
            }
            children={
                <div
                    className="flex w-[280px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px] max-h-[50vh] overflow-y-scroll sm:absolute sm:left-0 sm:translate-x-0 translate-x-[-100%]">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-navy-700 dark:text-white">
                            Notification
                        </p>

                    </div>
                    {notification?.map((item, index) => (
                        <button key={index}
                                className="flex p-2 w-full items-center hover:bg-gray-200 ease-in-out duration-300"
                                onClick={() => mutation.mutate(item.notificationId)}>

                            <div
                                className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm relative ">
                                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                                    {item.content}
                                </p>
                                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                                    {item.createTime}
                                </p>
                                {!item.read && (
                                    <div
                                        className={"flex justify-center items-center h-2 w-2 bg-brand-500 rounded-full absolute top-2 right-2 hover:h-5 hover:w-5  hover:rounded-none ease-in-out duration-300"}>


                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            }
            classNames={"py-2 top-4 w-max"}
        />
    );
};

export default Notifications;
