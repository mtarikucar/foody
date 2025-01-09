import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import AddBranchBanner from "../../../../../components/AddBranchBanner";
import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { FaArrowRight } from 'react-icons/fa';
import Spinner from "../../../../../components/Spinner/Spinner";

const Branches = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();

    const { data: branches, isLoading, isError, error } = useQuery('branches', async () => {
        const response = await axiosPrivate.get(`/branch?companyId=${auth.companyId}`);
        return response.data;
    });

    const columns = useMemo(() => [
        {
            Header: 'Fotoğraf',
            accessor: 'picture',
            Cell: ({ cell: { value } }) => <img src={value||"https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"} alt="Şube Fotoğrafı" className="w-16 h-16 object-cover rounded-lg shadow-md" />
        },
        { Header: 'Şube Adı', accessor: 'branchName' },
        { Header: 'Adres', accessor: 'address' },
        { Header: 'Oluşturulma Tarihi', accessor: 'createTime' },
        {
            Header: 'Şubeye Git',
            accessor: 'branchId',
            Cell: ({ cell: { value } }) => (
                <Link to={`/admin/branches/${value}`} className="text-indigo-500 hover:text-indigo-700">
                    <FaArrowRight className="w-5 h-5" />
                </Link>
            )
        }
    ], []);

    const data = useMemo(() => branches ? branches.data : [], [branches]);

    const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = tableInstance;

    if (isLoading) return <div><Spinner loading={true} size={60} /></div>;
    if (isError) return <div>An error occurred: {error.message}</div>;

    return (
        <div className="grid h-full grid-cols-1 gap-5 p-5 ">
            <div className="text-2xl font-bold flex justify-start items-center ml-3">
                Şubeler
            </div>
            <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
                <AddBranchBanner />
                <div className="z-20 mt-4">
                    <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
                        <table {...getTableProps()} className="w-full min-w-[500px]">
                            <thead className="bg-indigo-500 text-white">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-4 text-sm font-medium text-left">
                                            <div className="flex items-center justify-between">
                                                {column.render("Header")}
                                                <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? ' 🔽'
                                                                : ' 🔼'
                                                            : ''}
                                                    </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} className="border-b last:border-0 hover:bg-gray-100">
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} className="py-3 px-4 text-sm text-gray-700">
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Branches;
