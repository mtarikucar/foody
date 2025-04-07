
import { MdBarChart, MdDashboard ,MdVerifiedUser,MdCoffee,MdPointOfSale} from "react-icons/md";

import {additionDataColumns, columnsDataCheck, columnsDataComplex} from "./variables/columnsData";

import Widget from "./components/Widget";
import ComplexTable from "./components/ComplexTable";
import {useQuery} from "react-query";
import React from "react";
import {axiosPrivate} from "../../../../api/axios";
import {useSelector} from "react-redux";
import Spinner from "../../../../components/Spinner/Spinner";

const Dashboard = () => {
  const companyId = useSelector((state) => state.auth.companyId);

    const { data: additionList = [], isLoading: isAdditionLoading, isError: isAdditionError, error: additionError } = useQuery(
        ['additionReport', companyId],
        async () => {
            if (companyId) {  
                const response = await axiosPrivate.get(`/report/addition-reports/${companyId}`);
                return response.data;
            }
            return [];  
        },
        {
            enabled: !!companyId,  
        }
    );

    const { data: reportWidgets, isLoading: isWidgetsLoading, isError: isWidgetsError, error: widgetsError } = useQuery(
        ['reportWidgets', companyId], 
        async () => {
            if (companyId) {  
                const response = await axiosPrivate.get(`/report/widgets/${companyId}`);
                return response.data;
            }
            return {};  
        },
        {
            enabled: !!companyId,  
        }
    );


    if (isAdditionLoading || isWidgetsLoading) return <Spinner loading={true} size={60} />;
    if (isAdditionError) return <div>An error occurred in additionList: {additionError.message}</div>;
    if (isWidgetsError) return <div>An error occurred in reportWidgets: {widgetsError.message}</div>;


  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Şirket Toplam Satış"}
          subtitle={"₺"+reportWidgets?.data.totalCompanyOrderPrice+".00"}
        />
        <Widget
          icon={<MdPointOfSale className="h-6 w-6" />}
          title={"Bu Ayki Toplam Satış"}
          subtitle={"₺"+reportWidgets?.data.totalMonthlyPrice+".00"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Toplam Spariş Sayısı"}
          subtitle={reportWidgets?.data.totalOrderCount}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Toplam Ürün Sayısı"}
          subtitle={reportWidgets?.data.totalProductCount}
        />
        <Widget
          icon={<MdVerifiedUser className="h-7 w-7" />}
          title={"Toplam Kullanıcı Sayısı"}
          subtitle={reportWidgets?.data.totalUserCount}
        />
        <Widget
          icon={<MdCoffee className="h-6 w-6" />}
          title={"Toplam Şube Sayısı"}
          subtitle={reportWidgets?.data.totalBranchCount}
        />
      </div>


      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-1">

        <ComplexTable
          columnsData={additionDataColumns}
          tableData={additionList?.data}
        />

      </div>
    </div>
  );
};

export default Dashboard;
