import {MdFileUpload} from "react-icons/md";
import Card from "../../../../components/card";
import React, {useEffect} from "react";
import {AiOutlineCheckCircle, AiOutlineCloseCircle} from "react-icons/ai";
import {NavLink} from "react-router-dom";

const   Requirements = ({branch, isRender}) => {

    const renderWarnings = () => {
        const branchDetails = {
            'companyId': {text: 'Şube bir şirket\'e bağlı', url: "/admin/profile"},
            'menuId': {text: 'Şubeye bir menu tanımlandı', url: "/admin/branches/" + branch.branchId},
            'branchName': {text: 'Şubenin Adı geçerliliğini korumaktadır', url: "/admin/branches/" + branch.branchId},
            'address': {text: 'Şubenin adresi eklenmiştir', url: "/admin/branches/" + branch.branchId},
            'phone': {text: 'Telefon Numarası eklenmiştir', url: "/admin/branches/" + branch.branchId},
        };

        return (
            <Card extra={"w-full h-full  p-3"}>
                {Object.keys(branchDetails).map(key => (
                    <div key={key} className="flex items-center gap-2 mt-2">
                        {branch[key] === null ?
                            (
                                <div className={"rounded cursor-pointer  animate-pulse"}>
                                    <NavLink to={branchDetails[key].url}
                                             className={'flex justify-center items-center gap-2'}><AiOutlineCloseCircle
                                        className="text-red-500 animate-bounce"/> {branchDetails[key].text}</NavLink>
                                    <div>

                                    </div>
                                </div>
                            ) :
                            (<div className={'flex justify-center items-center gap-2'}><AiOutlineCheckCircle
                                className="text-green-500"/> {branchDetails[key].text}</div>)
                        }
                    </div>
                ))}
            </Card>
        );
    };


    const isComplete = branch && Object.keys(branch)?.every(key => branch[key] !== null);

    useEffect(() => {
        if (isComplete) {
            isRender(isComplete)
        }
    }, [isComplete]);

    if (isComplete) {
        return null;
    }


    return (
        <Card
            className="grid h-full w-full grid-cols-2 gap-3  bg-white  bg-clip-border p-3 font-dm  dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">


            <div
                className="col-span-12 flex h-full w-full flex-col justify-center items-center overflow-hidden rounded-xl bg-white pb-4">
                <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
                    Şubenin eksiklerini tamamla
                </h5>
                <p className="leading-1 mt-2 text-base font-normal text-gray-600">
                    {renderWarnings()}
                </p>
            </div>
        </Card>
    );
};

export default Requirements;
