import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import CustomPagination from './customPagination';
import CustomList from "../views/admin/branch/components/CustomList";
import useAuth from "../hooks/useAuth";
import { useFormik } from 'formik';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProductList = ({ menuId, categoryId = "" }) => {
    const auth = useAuth();
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageLimit = 10;
    const axiosPrivate = useAxiosPrivate();

    const formik = useFormik({
        initialValues: {
            name: '',
            minPrice: null,
            maxPrice: null,
            categoryId: categoryId,
            minRating: null,
            maxRating: null
        },
        onSubmit: (values) => {
            setCurrentPage(0);
        },
    });

    useEffect(() => {
        formik.setFieldValue("categoryId", categoryId);
    }, [categoryId]);

    const {
        data: products,
        isLoading,
        isError,
        error
    } = useQuery(['products', currentPage, pageLimit, formik.values], async () => {
        const response = await axiosPrivate.get(`/product${menuId ? `/list?menuId=${menuId}` : ''}`, {
            params: {
                companyId: auth.companyId, ...formik.values, page: currentPage - 1, size: pageLimit, sortBy: 'productId'
            }
        });
        return response.data;
    }, {
        keepPreviousData: true,
    });

    const { data: categories } = useQuery('categories', async () => {
        const response = await axiosPrivate.get(`/category?${auth.companyId}`);
        return response.data;
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (isError) return <div>Hata: {error.message}</div>;

    return (
        <div className="col-span-2">
            <div className="">
                <div className="flex flex-col">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                        <form onChange={formik.handleChange} className="">
                            <div className="relative mb-2 w-full flex items-center justify-between rounded-md">
                                <svg className="absolute left-2 block h-5 w-5 text-gray-400"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" className=""></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" className=""></line>
                                </svg>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    className="h-12 w-full cursor-text rounded-md border border-gray-100 py-4 pr-40 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder="Ürün adına göre ara .." />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="flex flex-row gap-x-2">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        onChange={formik.handleChange}
                                        value={formik.values.minPrice}
                                        placeholder="Min Fiyat"
                                        className="mt-2 block w-full rounded-md border border-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        onChange={formik.handleChange}
                                        value={formik.values.maxPrice}
                                        placeholder="Max Fiyat"
                                        className="mt-2 block w-full rounded-md border border-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                </div>

                                <div className="flex flex-col">
                                    <select
                                        name="categoryId"
                                        onChange={formik.handleChange}
                                        value={formik.values.categoryId}
                                        id="category"
                                        className="mt-2 block w-full rounded-md border border-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                        <option value="">Kategori Seç</option>
                                        {categories?.data?.map(category => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-row gap-x-2">
                                    <select
                                        id="minRating"
                                        name="minRating"
                                        onChange={formik.handleChange}
                                        value={formik.values.minRating}
                                        className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                        <option value="">Min Değerlendirme</option>
                                        <option value="1">1 Yıldız</option>
                                        <option value="2">2 Yıldız</option>
                                        <option value="3">3 Yıldız</option>
                                        <option value="4">4 Yıldız</option>
                                    </select>

                                    <select
                                        id="maxRating"
                                        name="maxRating"
                                        onChange={formik.handleChange}
                                        value={formik.values.maxRating}
                                        className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                        <option value="">Max Değerlendirme</option>
                                        <option value="1">1 Yıldız</option>
                                        <option value="2">2 Yıldız</option>
                                        <option value="3">3 Yıldız</option>
                                        <option value="4">4 Yıldız</option>
                                        <option value="5">5 Yıldız</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {products &&
                <div>
                    <CustomList datas={products?.data?.content || products?.data} menuId={menuId} />
                    <div className={"mt-4"}>
                        <CustomPagination
                            current={currentPage}
                            limit={products?.data.totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            }
        </div>
    );
};

export default ProductList;
