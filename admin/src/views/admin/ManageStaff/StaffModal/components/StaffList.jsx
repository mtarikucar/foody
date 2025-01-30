import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import {useMutation, useQuery, useQueryClient} from 'react-query';
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../../hooks/useAuth";
import Spinner from "../../../../../components/Spinner/Spinner";
import Checkbox from "../../../../../components/checkbox";
import Switch from "../../../../../components/switch";
import {setBranch} from "../../../../../store/AuthSlice";
import {toast} from "react-toastify";

const StaffList = () => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const auth = useAuth();

    const url = `/users?companyId=${auth?.companyId}${auth?.branchId ? `&branchId=${auth?.branchId}` : ''}`;
    const { data: staff, isLoading, isError, error } = useQuery(['staffs'], async () => {
        const response = await axiosPrivate.get(url);
        return response.data;
    });

    const { mutate: changeStatus } = useMutation(async ({ id, status }) => {
        await axiosPrivate.post(`/users/change-user-status/${id}`, {}, {
            params: {
                status: status
            }
        });
    },
    {
        onSuccess: () => {
            toast("Durum başarıyla güncellendi");
            queryClient.invalidateQueries(['staffs']);
        }
    });

    const getRoles ={
        'ADMIN': 'Yönetici',
        'MANAGER': 'Müdür',
        'STAFF': 'Personel'
    }

    const columns = useMemo(() => [
        { Header: 'İsim', accessor: 'firstName' },
        { Header: 'Soyisim', accessor: 'lastName' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Telefon Numarası', accessor: 'phoneNumber' },
        { Header: 'Rol', accessor: 'role', Cell: ({ value }) => getRoles[value] || value },
        { Header: 'Oluşturulma Tarihi', accessor: 'createTime' },
        {
            Header: "Durum", accessor: 'active',
            Cell: ({ row }) => (
                <Switch  checked={row.original.active}
                          onChange={() => changeStatus({ id: row.original.userId, status: !row.original.active })}/>
            )
        },
    ], [changeStatus]);

    const data = useMemo(() => staff ? staff.data : [], [staff]);

    const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = tableInstance;

    if (isLoading) return <Spinner loading={true} size={60} />;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="staff-list h-dvh bg-white shadow rounded-lg p-4">
            <div className={"flex justify-center items-center p-2 font-bold text-xl"}> Çalışanlar</div>
            <div className="w-full overflow-x-auto px-4">
                <table {...getTableProps()} className="w-full min-w-[500px] border-collapse border border-gray-300">
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="py-3 px-4 text-sm font-medium text-left text-gray-700 border border-gray-300">
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
                            <tr {...row.getRowProps()} className="bord  er-b last:border-0 hover:bg-gray-100">
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="py-3 px-4 text-sm text-gray-700 border border-gray-300">
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
