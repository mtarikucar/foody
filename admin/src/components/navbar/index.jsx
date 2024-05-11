import React, {useEffect, useState} from "react";
import Dropdown from "../dropdown";
import {FiAlignJustify} from "react-icons/fi";
import {Link} from "react-router-dom";
import navbarimage from "../../assets/img/layout/Navbar.png";
import {BsArrowBarUp} from "react-icons/bs";
import {FiSearch} from "react-icons/fi";
import {RiMoonFill, RiSunFill} from "react-icons/ri";
import {
    IoMdNotificationsOutline,
    IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "../../assets/img/avatars/avatar4.png";
import {useDispatch} from "react-redux";
import {logoutSuccess} from "../../store/AuthSlice";
import useAuth from "../../hooks/useAuth";
import {useWebSocket} from "../../context/socket/WebSocketContext";
import {useQuery, useQueryClient} from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Navbar = (props) => {
        const {onOpenSidenav, brandText} = props;
        const [darkmode, setDarkmode] = React.useState(false);
        const [receivedData, setReceivedData] = useState([]);
        const axiosPrivate = useAxiosPrivate();
        const dispatch = useDispatch()
        const auth = useAuth()
        const socket = useWebSocket()
    const queryClient = useQueryClient();


        useEffect(() => {
            if (socket) {
                socket.subscribe('/topic/notification/' + auth.currentUser, (message) => {
                    setReceivedData(receivedData => [...receivedData, JSON.parse(message.body)]);
                });
            }

            return () => {

                socket?.unsubscribe('/topic/notification/' + auth.currentUser);
            }
        }, [socket])


        const {data: notification} = useQuery('notification', async () => {
            const response = await axiosPrivate.get(`/notification?userId=${auth.currentUser}`);
            return response.data.data;
        });


        useEffect(() => {
            queryClient.invalidateQueries('notification')
        }, [receivedData])

        return (
            <nav
                className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">

                <div
                    className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
                    {/* Profile & Dropdown */}
                    <span
                        className="flex cursor-pointer text-xl text-gray-600 dark:text-white ml-3"
                        onClick={onOpenSidenav}
                    >
                    <FiAlignJustify className="h-5 w-5"/>
                </span>

                    <div
                        className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                        <p className="pl-3 pr-2 text-xl">
                            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white"/>
                        </p>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                        />
                    </div>

                    <Dropdown
                        button={
                            <p className="cursor-pointer">
                                <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white"/>
                            </p>
                        }

                        children={
                            <div
                                className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px] max-h-[50vh] overflow-y-scroll">
                                <div className="flex items-center justify-between">
                                    <p className="text-base font-bold text-navy-700 dark:text-white">
                                        Notification
                                    </p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        Mark all read
                                    </p>
                                </div>
                                {notification?.map((item, index) => (
                                    <button key={index}
                                            className="flex w-full items-center">
                                        <div
                                            className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                                            <BsArrowBarUp/>
                                        </div>
                                        <div
                                            className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                                            <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                                                {item.content}
                                            </p>
                                            <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                                                {item.createTime}
                                            </p>
                                        </div>
                                    </button>
                                ))}


                            </div>
                        }
                        classNames={"py-2 top-4  w-max"}
                    />

                    <Dropdown
                        button={
                            <p className="cursor-pointer">
                                <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white"/>
                            </p>
                        }
                        children={
                            <div
                                className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                                <div
                                    style={{
                                        backgroundImage: `url(${navbarimage})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                    }}
                                    className="mb-2 aspect-video w-full rounded-lg"
                                />
                                <a
                                    target="blank"
                                    href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"
                                    className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
                                >
                                    Buy Horizon UI PRO
                                </a>
                                <a
                                    target="blank"
                                    href="https://horizon-ui.com/docs-tailwind/docs/react/installation?ref=live-free-tailwind-react"
                                    className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
                                >
                                    See Documentation
                                </a>
                                <a
                                    target="blank"
                                    href="https://horizon-ui.com/?ref=live-free-tailwind-react"
                                    className="hover:bg-black px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:text-navy-700 dark:text-white dark:hover:text-white"
                                >
                                    Try PhiloFoodie Free
                                </a>
                            </div>
                        }
                        classNames={"py-2 top-6 w-max"}

                    />
                    {/*<div
                        className="cursor-pointer text-gray-600"
                        onClick={() => {
                            if (darkmode) {
                                document.body.classList.remove("dark");
                                setDarkmode(false);
                            } else {
                                document.body.classList.add("dark");
                                setDarkmode(true);
                            }
                        }}
                    >
                        {darkmode ? (
                            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white"/>
                        ) : (
                            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white"/>
                        )}
                    </div>*/}
                    <Dropdown
                        button={
                            <img
                                className="h-10 w-10 rounded-full"
                                src={auth.companyLogo || avatar}
                                alt="Elon Musk"
                            />
                        }

                        children={
                            <div
                                className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                                <div className="p-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            👋 Hey, Adela
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-gray-200 dark:bg-white/20 "/>

                                <div className="flex flex-col p-4">
                                    <Link to={"/admin/profile"}

                                          className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                                    >
                                        Profile
                                    </Link>
                                    <a
                                        href=" "
                                        className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                                        onClick={() => dispatch(logoutSuccess())}
                                    >
                                        Log Out
                                    </a>
                                </div>
                            </div>
                        }
                        classNames={"py-2 top-8 w-max"}
                    />


                </div>
                <div className="ml-[6px]   ">
                    <div className="h-6 w-[224px] pt-1 ">
                        <a
                            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                            href=" "
                        >
                            Sayfalar
                            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">

                /
                </span>
                        </a>
                        <Link
                            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                            to="#"
                        >
                            {brandText}
                        </Link>
                    </div>
                    <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
                        <Link
                            to="#"
                            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
                        >
                            {brandText}
                        </Link>
                    </p>
                </div>
            </nav>
        );
    }
;

export default Navbar;
