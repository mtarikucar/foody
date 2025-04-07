import React, {useState, useEffect} from "react";
import Banner from "./components/Banner";
import {useQuery} from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/card";
import AddBranchBanner from "../../../components/AddBranchBanner";
import {NavLink} from "react-router-dom";
import banner from "../../../assets/img/profile/banner.png";
import {Button} from "@chakra-ui/button";
import {FaExchangeAlt, FaPlus} from "react-icons/fa";
import Spinner from "../../../components/Spinner/Spinner";
import MenuModal from "../branch/components/MenuModal";
import CodeModal from "../branch/components/CodeModal";
import Upload from "../branch/components/Upload";

const ProfileOverview = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();

    const {data: company, companyIsLoading, companyError} = useQuery(["company"], async () => {
        const response = await axiosPrivate.get(`/company/${auth?.companyId}`);
        return response.data.data;
    });

    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [requirementComplete, setRequirementComplete] = useState(false);

    const {data: branch, branchIsLoading, branchError} = useQuery(["branch"], async () => {
        const response = await axiosPrivate.get(`/branch/${auth?.branchId}`);
        return response.data.data;
    });

    useEffect(() => {
        if (!auth?.menuId) {
            setIsMenuModalOpen(true);
        }
    }, [auth?.menuId]);

    const handleMenuSelection = (menuId) => {
        auth.menuId = menuId;
        setIsMenuModalOpen(false);
    };

    //menuId: fff9efe7-fbe6-4607-9a29-dcb93c94eee0  branchId :9d2bfa71-6038-46f1-b580-3fe0599feb9a

    if (branchIsLoading && companyIsLoading) return <div><Spinner loading={true} size={60}/></div>;
    if (branchError && companyError) return <div>Bir hata oluştu</div>;

    return (
        <div className="flex w-full flex-col gap-5">
            <MenuModal
                isOpen={isMenuModalOpen}
                onClose={() => setIsMenuModalOpen(false)}
                branch={branch}
                onMenuSelect={handleMenuSelection}
                message={"Şübenizin menüsü bulunamamktadır. Lütfen bir menü seçiniz."}
            />
            <CodeModal
                isOpen={isCodeModalOpen}
                onClose={() => setIsCodeModalOpen(!isCodeModalOpen)}
            />
            <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">

                <div className={`${auth.package ? "col-span-12" : "col-span-6"}`}>
                    <Banner company={company}/>
                </div>

                <div className="col-span-6 lg:!mb-0">
                    <div className={`lg:!mb-0 ${requirementComplete ? "col-span-12" : "col-span-6"}`}>
                        <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
                            <div
                                className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                                style={{backgroundImage: `url(${banner})`}}
                            />
                            <div className="mt-2 flex flex-col items-center">
                                <h4 className="text-xl font-bold uppercase text-navy-700 dark:text-white">
                                    {branch?.branchName}
                                </h4>
                                <p className="text-base font-normal text-gray-600">{branch?.phone}</p>
                                <p className="text-base font-normal text-gray-600">{branch?.address}</p>
                            </div>
                            <div className="w-full my-3 flex gap-1">
                                <div
                                    className="flex flex-col items-center justify-center border-2 rounded-lg w-full m-2">
                                    <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
                                    <p className="text-sm font-normal text-gray-600">Aktif çalışan sayısı</p>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center border-2 rounded-lg w-full py-2 m-2">
                                    <p className="text-2xl font-bold text-navy-700 dark:text-white">9.7K</p>
                                    <p className="text-sm font-normal text-gray-600">Günlük ziyaret sayısı</p>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center border-2 rounded-lg w-full py-2 m-2">
                                    <p className="text-xl uppercase font-bold text-navy-700 dark:text-white">{branch?.menuName}</p>
                                    <Button
                                        onClick={() => setIsMenuModalOpen(!isMenuModalOpen)}
                                        colorScheme="blue"
                                        variant="solid"
                                        leftIcon={branch?.menuId ? <FaExchangeAlt/> : <FaPlus/>}
                                        className="group"
                                    >
                                        {branch?.menuId ? "Menüyü Değiştir" : "Menü Ekle"}
                                    </Button>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center hover:cursor-pointer border-2 rounded-lg w-full py-2 m-2"
                                    onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
                                >
                                    <div className="flex flex-col items-center text-center justify-center group">
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
                </div>
                <div className="col-span-6 lg:!mb-0">
                    <AddBranchBanner/>
                </div>
                <div className="lg:!mb-0 col-span-3 h-full">
                    <Card extra={"flex items-center w-full h-full p-[16px] bg-cover"}>
                        <div className="w-full h-full  flex flex-col items-center justify-center">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                Çalışanları Yönet
                            </h4>
                            <p className="text-base font-normal text-gray-600">
                                Çalışanlarınızı buradan yönetebilirsiniz.
                            </p>
                            <NavLink
                                to={`/admin/staffs/${auth?.branchId}`}
                                className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                            >
                                Çalışanları Yönet
                            </NavLink>
                        </div>
                    </Card>
                </div>
                <div className="lg:!mb-0 col-span-3">
                    {
                        branch && (
                            <Upload branch={branch}/>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
