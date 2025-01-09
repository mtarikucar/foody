import {useQuery, useMutation, useQueryClient} from 'react-query';
import {useState} from 'react';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import Modal from '../../../../../components/modal';
import CustomCard from '../../../../../components/card/CustomCard';
import useAuth from "../../../../../hooks/useAuth";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {setBranch} from "../../../../../store/AuthSlice";

function Index({isOpen, onClose, branch,message=""}) {
    const auth = useAuth();
    const [selectedMenu, setSelectedMenu] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const {data: menus, isLoading, error} = useQuery('menus', async () => {
            const response = await axiosPrivate.get(`/menu?companyId=${auth.companyId}`);
            return response.data;
        },
        {
            onSuccess: (data) => {
                setSelectedMenu(data.data.find(menu => menu.menuId === branch.menuId)?.menuId);
            }
        });

    const handleChange = (menuId) => {
        setSelectedMenu(menuId);
    };

    const mutation = useMutation(selectedMenu => {
        return axiosPrivate.put(`/branch/${branch.branchId}`, {
            menuId: selectedMenu
        });
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("branch");
            dispatch(setBranch({ branchId: branch.branchId, menuId: selectedMenu}));
            toast("Menü değiştirildi");
            onClose();
        }
    });

    const handleSave = () => {
        mutation.mutate(selectedMenu);
    };

    return (
        <Modal title={'Şube Menüsü'} description={message||"Şubeye ekleyebileceğin menüler"} size="extraLarge" isOpen={isOpen}
               onClose={onClose}>
            <div className="grid grid-cols-3 gap-5 m-3">
                {menus && menus.data.map(menu => (
                    <div key={menu.menuId} onClick={() => handleChange(menu.menuId)}>
                        <CustomCard
                            title={menu.menuName}
                            author={menu.address}
                            createTime={menu.createTime}
                            extra={selectedMenu === menu.menuId ? "bg-gray-200" : ""}
                            isSelected={selectedMenu === menu.menuId}
                        />
                    </div>
                ))}
            </div>
            <button
                className='border w-full m-2 bg-gray-200 p-2 hover:bg-purple-600 rounded ease-in-out duration-200 hover:text-white'
                onClick={handleSave}
                disabled={!selectedMenu || mutation.isLoading}
            >
                {mutation.isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
        </Modal>
    );
}

export default Index;
