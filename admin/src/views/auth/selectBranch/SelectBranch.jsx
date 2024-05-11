import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import {useQuery} from "react-query";
import CustomCard from "../../../components/card/CustomCard";
import {useDispatch} from "react-redux";
import {setBranch} from "../../../store/AuthSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Banner from "../../../components/AddBranchBanner";
import Spinner from "../../../components/Spinner/Spinner";
import AddBranchBanner from "../../../components/AddBranchBanner";



const SelectBranch = () => {

    const axiosPrivate = useAxiosPrivate()
    const auth = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {data: branches, isLoading, error} = useQuery('branches', async () => {
        const response = await axiosPrivate.get(`/branch?companyId=${auth.companyId}`);
        return response.data;
    });

    return (
        <div className="flex justify-center items-center min-h-screen px-2">
            <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">

                <AddBranchBanner/>
               {/* <Banner open={error}/>*/}
                {isLoading && <div className={"flex justify-center items-center m-24"}>
                    <Spinner/>
                </div>}
                <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-3 mt-4">
                    {
                        branches &&
                        branches?.data?.map((branch, key) => (
                            <div key={key} className={"hover:-translate-y-2 ease-in-out duration-200 cursor-pointer"}
                                 onClick={() => {
                                     dispatch(setBranch({branchId: branch.branchId, menuId: branch.menuId}))
                                     navigate("/")
                                     toast.info("sube degistirildi")
                                 }}>

                                <CustomCard
                                    key={branch.branchId}

                                    title={branch.branchName}
                                    author={branch.address}
                                    price={branch.createTime}

                                />
                            </div>
                        ))
                    }
                </div>


            </div>


        </div>
    );
};

export default SelectBranch;
