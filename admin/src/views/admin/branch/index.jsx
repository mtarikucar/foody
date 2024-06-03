import { useQuery } from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { NavLink, useParams } from "react-router-dom";
import Upload from "./components/Upload";
import React, { useState } from "react";
import Card from "../../../components/card";
import MenuModal from "./components/MenuModal";
import CodeModal from "./components/CodeModal";
import banner from "../../../assets/img/profile/banner.png";

const Branch = () => {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();

    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [requirementComplete, setRequirementComplete] = useState(false);

    const { data: branch, isLoading, error } = useQuery("branch", async () => {
        const response = await axiosPrivate.get(`/branch/${id}`);
        return response.data.data;
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred</div>;

    return (
        <div className="flex w-full flex-col gap-5">
            <MenuModal
                isOpen={isMenuModalOpen}
                onClose={() => setIsMenuModalOpen(!isMenuModalOpen)}
                branch={branch}
            />
            <CodeModal
                isOpen={isCodeModalOpen}
                onClose={() => setIsCodeModalOpen(!isCodeModalOpen)}
            />

            <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
                <div className={`lg:!mb-0 ${requirementComplete ? "col-span-12" : "col-span-6"}`}>
                    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
                        <div
                            className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                            style={{backgroundImage: `url(${banner})`}}
                        />
                        <div className="mt-2 flex flex-col items-center">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                {branch?.branchName}
                            </h4>
                            <p className="text-base font-normal text-gray-600">{branch?.phone}</p>
                            <p className="text-base font-normal text-gray-600">{branch?.address}</p>
                        </div>
                        <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
                                <p className="text-sm font-normal text-gray-600">Aktif çalışan sayısı</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold text-navy-700 dark:text-white">9.7K</p>
                                <p className="text-sm font-normal text-gray-600">Günlük ziyaret sayısı</p>
                            </div>
                            <div
                                className="flex flex-col items-center justify-center hover:cursor-pointer"
                                onClick={() => setIsMenuModalOpen(!isMenuModalOpen)}
                            >
                                <div className="flex flex-col items-center justify-center group">
                                    {!branch?.menuId ? (
                                        <>
                                            <svg
                                                className="justify-center mb-3 h-12 w-12 ease-in-out duration-300 text-gray-700"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="gray"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                                                />
                                            </svg>
                                            <span>Şubeye bir menü tanımla</span>
                                        </>
                                    ) : (
                                        <>
                                            <div>{branch?.menuName}</div>
                                            <svg
                                                className="justify-center mb-3 h-12 w-12 ease-in-out duration-300 text-gray-700"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="transparent"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="gray"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                                                />
                                            </svg>
                                            <span>Tanımlı olan menüyü değiştir</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div
                                className="flex flex-col items-center justify-center hover:cursor-pointer"
                                onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
                            >
                                <div className="flex flex-col items-center justify-center group">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="gray"
                                        className="justify-center mb-3 h-12 w-12 ease-in-out duration-300 text-gray-700"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z"
                                        />
                                    </svg>
                                    <span>QR kod ile menüyü görüntüle</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                    <div className="lg:!mb-0 col-span-3">
                        <Card extra={"items-center w-full h-full  "}>
                            <Upload branch={branch} />
                        </Card>
                    </div>


                    <div className="lg:!mb-0 col-span-3">
                        <Card extra={"flex items-center w-full h-full p-[16px] bg-cover"}>
                            <div className="w-full h-full  flex flex-col items-center justify-center">
                                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                    Çalışanları Yönet
                                </h4>
                                <p className="text-base font-normal text-gray-600">
                                    Çalışanlarınızı buradan yönetebilirsiniz.
                                </p>
                                <NavLink
                                    to={"/admin/staffs/" + id}
                                    className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                                >
                                    Çalışanları Yönet
                                </NavLink>
                            </div>
                        </Card>
                    </div>

            </div>


        </div>
    );
};

export default Branch;
