import {useQuery, useMutation, useQueryClient} from 'react-query';
import {useState} from 'react';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import Modal from '../../../../../components/modal';
import CustomCard from '../../../../../components/card/CustomCard';
import useAuth from "../../../../../hooks/useAuth";
import {toast} from "react-toastify";

function Index({isOpen, onClose, branch}) {
    const auth = useAuth();
    const [selectedMenu, setSelectedMenu] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient()

    const {data: menus, isLoading, error} = useQuery('menus', async () => {
        const response = await axiosPrivate.get(`/menu?companyId=${auth.companyId}`);
        return response.data;
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
            queryClient.invalidateQueries("branch")
            toast("menu degistirlidi")
            onClose()
        }
    });

    const handleSave = () => {
        mutation.mutate(selectedMenu);
    };

    return (
        <Modal title={'sube-menu'} description={"menuyu ekleyebillecegin subeler"} size="extraLarge" isOpen={isOpen}
               onClose={onClose}>
            <div className="grid grid-cols-3 gap-2">
                {menus && menus.data.filter(menu => menu.menuId != branch.menuId).map(menu => (
                    <div key={menu.menuId} onClick={() => handleChange(menu.menuId)}>
                        <CustomCard
                            title={menu.menuName}
                            author={menu.address}
                            price={menu.createTime}
                            extra={selectedMenu === menu.menuId ? "bg-gray-200" : ""}
                        />
                    </div>
                ))}
            </div>
            <button
                className='border m-2 bg-gray-200 p-2 hover:bg-purple-600 rounded ease-in-out duration-200 hover:text-white'
                onClick={handleSave}>Kaydet
            </button>
        </Modal>
    );
}

export default Index;
