import React, {useEffect, useMemo} from 'react';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setBranch } from "../../../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddBranchBanner from "../../../components/AddBranchBanner";
import Spinner from "../../../components/Spinner/Spinner";
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaArrowRight } from 'react-icons/fa';

const SelectBranch = () => {
    const axiosPrivate = useAxiosPrivate();
    const auth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: branches, isLoading, isError, error } = useQuery('branches', async () => {
        const response = await axiosPrivate.get(`/branch?companyId=${auth.companyId}`);
        return response.data;
    });

    const columns = useMemo(
        () => [
            {
                Header: 'Fotoğraf',
                accessor: 'picture',
                Cell: ({ cell: { value } }) => (
                    <img
                        src={
                            value ||
                            "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"
                        }
                        alt="Şube Fotoğrafı"
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                    />
                ),
            },
            { Header: 'Şube Adı', accessor: 'branchName' },
            { Header: 'Adres', accessor: 'address' },
            { Header: 'Oluşturulma Tarihi', accessor: 'createTime' },
            {
                Header: 'Seç',
                accessor: 'branchId',
                Cell: ({ row }) => (
                    <button
                        className="text-indigo-500 hover:text-indigo-400 dark:text-indigo-300 dark:hover:text-indigo-500"
                        onClick={() => {
                            dispatch(setBranch({ branchId: row.original.branchId, menuId: row.original.menuId }));
                            navigate("/");
                            toast.info("Şube değiştirildi");
                        }}
                    >
                        <FaArrowRight className="w-5 h-5" />
                    </button>
                ),
            },
        ],
        [dispatch, navigate, toast]
    );

    const data = useMemo(() => (branches ? branches.data : []), [branches]);

    const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = tableInstance;

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );

    if (isError) return <div className="text-red-500 dark:text-red-300">An error occurred: {error.message}</div>;

    return (
        <div className="grid grid-cols-3 gap-4 min-h-screen px-4 py-4 ">
            {/* Left Section: Table */}
            <div className="col-span-2 bg-white dark:bg-gray-800 dark:text-gray-100 p-4 shadow-md rounded-lg">
                <div className="text-2xl font-bold mb-4">Şube Seç</div>
                <div className="w-full overflow-x-auto">
                    <table {...getTableProps()} className="w-full min-w-[500px]">
                        <thead className="bg-indigo-500 text-white dark:bg-indigo-700">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="py-3 px-4 text-sm font-medium text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            {column.render("Header")}
                                            <span>
                          {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                        </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className="border-b last:border-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {row.cells.map((cell) => (
                                        <td
                                            {...cell.getCellProps()}
                                            className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300"
                                        >
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

            {/* Right Section: Add Branch */}
            <div className="col-span-1 bg-white dark:bg-gray-800 dark:text-gray-100 p-4 shadow-md rounded-lg">
                <div className="text-xl font-bold mb-4">Yeni Şube Ekle</div>
                <AddBranchBanner />
                <div className="mt-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Yeni bir şube eklemek için yukarıdaki düğmeyi kullanabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SelectBranch;
