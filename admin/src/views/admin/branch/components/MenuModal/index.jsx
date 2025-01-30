import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import Modal from '../../../../../components/modal';
import useAuth from "../../../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setBranch } from "../../../../../store/AuthSlice";

function BranchMenuModal({ isOpen, onClose, branch, message = "" }) {
    const auth = useAuth();
    const [selectedMenu, setSelectedMenu] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const { data: menus, isLoading } = useQuery('menus', async () => {
        const response = await axiosPrivate.get(`/menu?companyId=${auth.companyId}`);
        return response.data;
    }, {
        onSuccess: (data) => {
            setSelectedMenu(data.data.find(menu => menu.menuId === branch.menuId)?.menuId || null);
        }
    });

    const mutation = useMutation(menuId => axiosPrivate.put(`/branch/${branch.branchId}`, { menuId }), {
        onSuccess: () => {
            queryClient.invalidateQueries("branch");
            dispatch(setBranch({ branchId: branch.branchId, menuId: selectedMenu }));
            toast.success("Menü başarıyla değiştirildi.");
            onClose();
        }
    });

    const handleSave = () => {
        mutation.mutate(selectedMenu);
    };

    return (
        <Modal title='Şube Menüsü' description={message || "Şubeye atanabilecek menüler"} size="large" isOpen={isOpen} onClose={onClose}>
            <div className="grid grid-cols-3 gap-5 m-3">
                {isLoading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    menus?.data?.map(menu => (
                        <div
                            key={menu.menuId}
                            className={`border rounded-lg p-4 shadow-md cursor-pointer transition ${selectedMenu === menu.menuId ? 'bg-teal-100 border-teal-500' : 'hover:bg-gray-100'}`}
                            onClick={() => setSelectedMenu(menu.menuId)}
                        >
                            <h3 className="text-lg font-bold text-gray-800">{menu.menuName}</h3>
                            <p className="text-sm text-gray-600">{menu.address}</p>
                            <p className="text-xs text-gray-400">Oluşturulma Tarihi: {menu.createTime}</p>
                            <p className="mt-2 text-gray-700">{menu.description}</p>
                        </div>
                    ))
                )}
            </div>
            <button
                className='w-full mt-4 p-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-200 disabled:bg-gray-300'
                onClick={handleSave}
                disabled={!selectedMenu || mutation.isLoading}
            >
                {mutation.isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
        </Modal>
    );
}

export default BranchMenuModal;
