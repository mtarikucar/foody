import CardMenu from "../../../../../components/card/CardMenu";
import Card from "../../../../../components/card";
import {useGlobalFilter, usePagination, useSortBy, useTable} from "react-table";
import {useMemo} from "react";
import {
    MdAttachMoney,
    MdOutlineLocationOn,
    MdCalendarToday,
    MdShoppingCart,
    MdPayment,
    MdChevronLeft,
    MdChevronRight,
    MdFirstPage,
    MdLastPage
} from "react-icons/md";

// Global Filter Component
const GlobalFilter = ({globalFilter, setGlobalFilter}) => {
    return (
        <div className="relative mb-4">
            <input
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                placeholder="Arama yap ..."
                className="border rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
        </div>
    );
};

const ComplexTable = (props) => {
    const {columnsData, tableData} = props;

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: {pageSize: 8}, // Correctly setting initialState here
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        pageOptions,
        gotoPage, // Add gotoPage here
        pageCount, // Add pageCount here
        state: {pageIndex, globalFilter},
        setGlobalFilter,
    } = tableInstance;

    // Total number of rows (records)
    const totalRecords = data.length;

    return (
        <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
            <div className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">Adisyon Tablosu</div>
                {/*<CardMenu/>*/}
            </div>

            {/* Global Search Input */}
            <div className="mt-4">

                <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>
            </div>
            <div className=" overflow-x-scroll xl:overflow-hidden">
                <table {...getTableProps()} className="w-full">
                    <thead>
                    {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column, index) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    key={index}
                                    className="border-b border-gray-300  text-start px-4 py-4 bg-gray-100 dark:bg-gray-800 dark:border-navy-700"
                                >
                                    <p className="text-xs tracking-wide text-gray-600">{column.render("Header")}</p>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps()}
                                key={index}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {row.cells.map((cell, index) => {
                                    let data = "";
                                    if (cell.column.Header === "#") {
                                        data = (
                                            <p className="text-sm font-bold text-navy-700 dark:text-whi te">
                                                {cell.value}
                                            </p>
                                        );
                                    } else if (cell.column.Header === "Toplam Ücret") {
                                        data = (
                                            <div className="flex items-center gap-2">
                                                <MdAttachMoney className="text-green-500"/>
                                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                    {cell.value} ₺
                                                </p>
                                            </div>
                                        );
                                    } else if (cell.column.Header === "Şübe") {
                                        data = (
                                            <div className="flex items-center gap-2">
                                                <MdOutlineLocationOn className="text-blue-500"/>
                                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                    {cell.value}
                                                </p>
                                            </div>
                                        );
                                    } else if (cell.column.Header === "Adisyon Tarihi") {
                                        data = (
                                            <div className="flex items-center gap-2">
                                                <MdCalendarToday className="text-gray-500"/>
                                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                    {cell.value}
                                                </p>
                                            </div>
                                        );
                                    } else if (cell.column.Header === "Nakit Tutarı") {
                                        data = (
                                            <div className="flex items-center gap-2">
                                                <MdPayment className="text-yellow-500"/>
                                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                    {cell.value ? `${cell.value} ₺` : "-"}
                                                </p>
                                            </div>
                                        );
                                    } else if (cell.column.Header === "Kard Tutarı") {
                                        data = (
                                            <div className="flex items-center gap-2">
                                                <MdPayment className="text-blue-500"/>
                                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                    {cell.value ? `${cell.value} ₺` : "-"}
                                                </p>
                                            </div>
                                        );
                                    } else if (cell.column.Header === "Spariş Sayısı") {
                                        data = (
                                            <div className="flex items-center gap-2">
                                                <MdShoppingCart className="text-red-500"/>
                                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                                    {cell.value}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <td
                                            className="pt-[14px] pb-[18px] sm:text-[14px] px-4"
                                            {...cell.getCellProps()}
                                            key={index}
                                        >
                                            {data}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
                {/* Previous and Next Page Controls */}
                <div className="flex items-center gap-2">
                    {/* Go to First Page */}
                    <button
                        onClick={() => gotoPage(0)} // First page
                        disabled={!canPreviousPage}
                        className="px-4 py-2 text-sm font-medium bg-gray-300 rounded flex items-center gap-1 disabled:opacity-50 transition ease-in-out hover:bg-gray-400"
                    >
                        <MdFirstPage className="text-lg"/>
                        İlk Sayfa
                    </button>

                    {/* Go to Last Page */}

                </div>

                {/* Page Information */}
                <div className="flex items-center text-sm gap-2">
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="px-4 py-2 text-sm font-medium bg-gray-300 rounded flex items-center gap-1 disabled:opacity-50 transition ease-in-out hover:bg-gray-400"
                    >
                        <MdChevronLeft className="text-lg"/>
                        Önceki
                    </button>
                    <div className={"mx-2 gap-2"}>
                        <span>Sayfa</span>
                        <strong className="px-2 py-1 bg-gray-100 rounded">{pageIndex + 1}</strong>
                        <span className={"mx-1"}>/</span>
                        <strong className="px-2 py-1 bg-gray-100 rounded">{pageOptions.length}</strong>
                    </div>
                    {/* Go to Next Page */}
                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="px-4 py-2 text-sm font-medium bg-gray-300 rounded flex items-center gap-1 disabled:opacity-50 transition ease-in-out hover:bg-gray-400"
                    >
                        Sonraki
                        <MdChevronRight className="text-lg"/>
                    </button>

                </div>

                {/* Display the total number of records */}
                <div className="flex items-center text-sm gap-2">
                    <span>Toplam Kayıt:</span>
                    <strong className="px-2 py-1 bg-gray-100 rounded">{totalRecords}</strong>
                    <button
                        onClick={() => gotoPage(pageCount - 1)} // Last page
                        disabled={!canNextPage}
                        className="px-4 py-2 text-sm font-medium bg-gray-300 rounded flex items-center gap-1 disabled:opacity-50 transition ease-in-out hover:bg-gray-400"
                    >
                        Son Sayfa
                        <MdLastPage className="text-lg"/>
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ComplexTable;
