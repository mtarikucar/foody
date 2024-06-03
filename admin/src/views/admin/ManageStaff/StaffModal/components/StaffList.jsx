import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useQuery } from 'react-query';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../../hooks/useAuth";

const StaffList = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();

    const { data: staff, isLoading, isError, error } = useQuery('staff', async () => {
        const response = await axiosPrivate.get(`/users?companyId=${auth.companyId}`);
        return response.data;
    });

    const columns = useMemo(() => [
        { Header: 'İsim', accessor: 'firstName' },
        { Header: 'Soyisim', accessor: 'lastName' },
        { Header: 'Rol', accessor: 'role' },
    ], []);

    const data = useMemo(() => staff ? staff.data : [], [staff]);

    const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = tableInstance;

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="staff-list h-dvh bg-white shadow rounded-lg p-4">
            {/* Table */}
            <div className="w-full overflow-x-auto px-4">
                <table {...getTableProps()} className="w-full min-w-[500px]">
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-4 text-sm font-medium text-left text-gray-700">
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
    );
};

export default StaffList;
