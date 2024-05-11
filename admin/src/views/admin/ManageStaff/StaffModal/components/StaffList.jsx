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
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'Role', accessor: 'role' },
    ], []);

    const data = useMemo(() => staff ? staff.data : [], [staff]);

    const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = tableInstance;

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="staff-list bg-white shadow rounded-lg p-4">
            {/* Table */}
            <div className="w-full overflow-x-scroll px-4 md:overflow-x-hidden">
                <table {...getTableProps()} className="w-full min-w-[500px] overflow-x-scroll">
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 text-sm">
                                    <div className="flex items-center justify-between pt-4 pb-2 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                                        {column.render("Header")}
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
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="py-3 text-sm">
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
