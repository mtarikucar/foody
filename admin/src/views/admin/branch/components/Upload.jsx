import { MdFileUpload } from "react-icons/md";
import React, { useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { NavLink } from "react-router-dom";

const Requirements = ({ branch, isRender }) => {
    const branchDetails = {
        companyId: { text: "Şube bir şirket'e bağlı", url: "/admin/profile" },
        menuId: { text: "Şubeye bir menu tanımlandı", url: "/admin/branches/" + branch.branchId },
        branchName: { text: "Şubenin Adı geçerliliğini korumaktadır", url: "/admin/branches/" + branch.branchId },
        address: { text: "Şubenin adresi eklenmiştir", url: "/admin/branches/" + branch.branchId },
        phone: { text: "Telefon Numarası eklenmiştir", url: "/admin/branches/" + branch.branchId },
    };

    const isComplete = branch && Object.keys(branch)?.every(key => branch[key] !== null);

    useEffect(() => {
        if (isComplete) {
            isRender(isComplete);
        }
    }, [isComplete]);

    if (isComplete) return null;

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md dark:bg-navy-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Şubenin eksiklerini tamamla</h2>
            <ul className="space-y-3">
                {Object.keys(branchDetails).map((key) => (
                    <li key={key} className="flex items-center gap-3">
                        {branch[key] === null ? (
                            <NavLink
                                to={branchDetails[key].url}
                                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition duration-300"
                            >
                                <AiOutlineCloseCircle className="text-2xl animate-bounce" />
                                {branchDetails[key].text}
                            </NavLink>
                        ) : (
                            <div className="flex items-center gap-2 text-green-500">
                                <AiOutlineCheckCircle className="text-2xl" />
                                {branchDetails[key].text}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Requirements;
