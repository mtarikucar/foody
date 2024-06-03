import Banner from "./components/Banner";
import { useQuery } from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { FaArrowRight } from 'react-icons/fa';

const Menus = () => {
    const companyId = useSelector((state) => state.auth.companyId);
    const axiosPrivate = useAxiosPrivate();

    const { data: menus, isLoading, isError, error } = useQuery('menus', async () => {
        const response = await axiosPrivate.get(`/menu?companyId=${companyId}`);
        return response.data;
    });

    const columns = useMemo(() => [
        { Header: 'Menu Adı', accessor: 'menuName' },
        { Header: 'Oluşturulma Tarihi', accessor: 'createTime' },
        { Header: 'Menu Rengi', accessor: 'color' },
        {
            Header: 'Şubeye Git',
            accessor: 'menuId',
            Cell: ({ cell: { value } }) => (
                <Link to={`/admin/menus/${value}`} className="text-indigo-500 hover:text-indigo-700">
                    <FaArrowRight className="w-5 h-5" />
                </Link>
            )
        }
    ], []);

    const data = useMemo(() => menus ? menus.data : [], [menus]);

    const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = tableInstance;

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>An error occurred: {error.message}</div>;

    return (
        <div className="mt-3 grid h-full grid-cols-1 gap-5 p-5 bg-gray-100">
            <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
                <Banner />
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
                                    <tr {...row.getRowProps()} className="border-b last:border-0 hover:bg-gray-100" style={{ backgroundColor: row.original.menuColor || 'white' }}>
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

export default Menus;
