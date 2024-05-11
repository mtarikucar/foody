import Banner from "./components/Banner";
import avatar1 from "../../../assets/img/avatars/avatar1.png";
import avatar2 from "../../../assets/img/avatars/avatar2.png";
import avatar3 from "../../../assets/img/avatars/avatar3.png";


import CustomCard from "../../../components/card/CustomCard";
import {useQuery} from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {Link, NavLink, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const Menus = () => {
    const companyId = useSelector((state) => state.auth.companyId);

    const axiosPrivate = useAxiosPrivate()
    const id = useParams()

    const {data: menus, isLoading, error} = useQuery('menus', async () => {
        const response = await axiosPrivate.get(`/menu?companyId=${companyId}`);
        return response.data;
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred</div>;
    return (
        <div className="mt-3 grid h-full grid-cols-1 gap-5">
            <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
                <Banner/>
                <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-3 mt-4">
                    {
                        menus &&
                        menus?.data?.map(Menu => (
                            <Link to={Menu.menuId} className=' hover:-translate-y-2 ease-in-out duration-300'>
                                <CustomCard
                                    key={Menu.menuId}
                                    bidders={[avatar1, avatar2, avatar3]} //categoriler listelencek
                                    title={Menu.menuName}
                                    author={Menu.address}
                                    price={Menu.createTime}
                                    color={Menu.color}
                                />

                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Menus;
