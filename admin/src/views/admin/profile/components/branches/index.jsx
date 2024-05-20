import { useQuery } from "react-query";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Button } from "@chakra-ui/button";
import { Link } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import CustomCard from "../../../../../components/card/CustomCard";
import AddBranchBanner from "../../../../../components/AddBranchBanner";



const Branches = () => {

  const axiosPrivate = useAxiosPrivate()
  const auth = useAuth()

  const { data: branches, isLoading, error } = useQuery('branches', async () => {
    const response = await axiosPrivate.get(`/branch?companyId=${auth.companyId}`);
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  return (
    <div className="grid h-full grid-cols-1 gap-5">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <div className="z-20 grid grid-cols-2 gap-5 md:grid-cols-4 mt-4">
          {
            branches &&
            branches?.data?.map((branch,key) => (
              <Link key={key} to={"/admin/branches/" + branch.branchId} className={"hover:-translate-y-2 ease-in-out duration-200"}>
                <CustomCard
                  key={branch.branchId}
                  title={branch.branchName}
                  author={branch.address}
                  price={branch.createTime}
                />
              </Link>
            ))
          }
        </div>
        <AddBranchBanner />

      </div>
    </div>
  );
};

export default Branches;
