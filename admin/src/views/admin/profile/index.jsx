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
import { FiSettings } from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";

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
        // Simulate updating the auth object with the selected menuId
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

               {/* <div className={`${auth.package ? "col-span-12" : "col-span-6"}`}>
                    <Banner company={company}/>
                </div>
*/}
                <div className="col-span-12 lg:!mb-0">
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
                                    className="flex gap-y-2 flex-col items-center justify-center border-2 rounded-lg w-full m-2">
                                    <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
                                    <p className="text-sm font-normal text-gray-600">Aktif çalışan sayısı</p>
                                </div>
                                <div
                                    className="flex gap-y-2 flex-col items-center justify-center border-2 rounded-lg w-full py-2 m-2">
                                    <p className="text-2xl font-bold text-navy-700 dark:text-white">9.7K</p>
                                    <p className="text-sm font-normal text-gray-600">Günlük ziyaret sayısı</p>
                                </div>
                                <div
                                    className="flex flex-col gap-y-2 items-center justify-center border-2 rounded-lg w-full py-2 m-2">
                                    <Button
                                        onClick={() => setIsMenuModalOpen(!isMenuModalOpen)}
                                        colorScheme="blue"
                                        variant="solid"
                                        leftIcon={branch?.menuId ? <FaExchangeAlt/> : <FaPlus/>}
                                        className="group"
                                    >
                                        {branch?.menuId ? "Menüyü Değiştir" : "Menü Ekle"}
                                    </Button>
                                    <p className="text-xl font-bold text-navy-700 dark:text-white">{branch?.menuName}</p>
                                </div>
                                <div
                                    className="flex flex-col items-center py-2  justify-center hover:cursor-pointer border-2 rounded-lg w-full py-2 m-2"
                                    onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
                                >
                                    <div className="flex gap-y-2 flex-col items-center text-center justify-center group">
                                        <IoQrCodeOutline className={"h-6 w-6"}/>
                                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                            QR kod ile menüyü görüntüle
                                        </h4>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center border-2 rounded-lg w-full py-2 m-2">
                                    <div className="w-full h-full  gap-y-2 py-2 flex flex-col items-center justify-center">
                                        <NavLink
                                            className=""
                                            to={`/admin/staffs/${auth?.branchId}`}
                                        >
                                            <FiSettings className={"h-6 w-6"}/>
                                        </NavLink>
                                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                            Çalışanları Yönet
                                        </h4>

                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="col-span-6 lg:!mb-0">
                    <AddBranchBanner/>
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
