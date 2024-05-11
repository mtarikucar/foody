import React, {useEffect, useState} from 'react';
import nft1 from '../assets/img/banner/menu4.webp';
import {useMutation, useQueryClient} from 'react-query';

import {toast} from 'react-toastify';
import {motion} from 'framer-motion';
import ilIlceData from "../assets/data/city.json";
import {useFormik} from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import PhoneInput from "react-phone-number-input";


const variants = {
    open: {opacity: 1, height: "auto", display: "block"}, closed: {opacity: 0, height: 0, display: "none"}
};

const AddBranchBanner = ({open = false}) => {
    const [isOpen, setIsOpen] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const auth = useAuth()
    const [selectedIl, setSelectedIl] = useState('');
    const [ilceler, setIlceler] = useState([]);
    useEffect(() => {
        setIsOpen(open)

    }, [open]);

    const handleIlChange = (event) => {
        const il = event.target.value;
        setSelectedIl(il);
        const ilData = ilIlceData.find((item) => item.il === il);
        setIlceler(ilData ? ilData.ilceleri : []);
    };

    const addBranchMutation = useMutation((branchData) => axiosPrivate.post(`/branch`, branchData), {
        onSuccess: () => {
            setIsOpen(false)
            queryClient.invalidateQueries("branches")
            toast.info("yeni sube olusturuldu")
        }, onError: (error) => {
            toast.error("birseyler yanlis gitti")

        },
    });

    const formik = useFormik({
        initialValues: {
            companyId: auth.companyId,
            branchName: '',
            phone: '',
            city: '',
            district: '',
            street: '',
            buildingNumber: '',
            apartmentNumber: '',
            openAddress: ''
        }, validationSchema: Yup.object({
            branchName: Yup.string()
                .required('Şube adı zorunludur'), phone: Yup.string()
                .required('Telefon numarası zorunludur'), city: Yup.string()
                .required('İl seçimi zorunludur'), district: Yup.string()
                .required('İlçe seçimi zorunludur'), street: Yup.string()
                .required('Cadde zorunludur'), buildingNumber: Yup.string()
                .required('Bina numarası zorunludur'), apartmentNumber: Yup.string()
                .required('Daire numarası zorunludur'), openAddress: Yup.string()
                .required('Açık adres zorunludur'),
        }), onSubmit: (values) => {
            const branchData = {...values, companyId: auth.companyId};
            addBranchMutation.mutate(branchData);
        },
    });

    return (<div className="flex w-full flex-col rounded-2xl bg-cover px-8 py-8 md:px-16 md:py-14 my-4 "
                 style={{backgroundImage: `url(${nft1})`}}>
        <div className="w-full backdrop-blur">
            <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                transition={{duration: 0.5}}
            >

                <form onSubmit={formik.handleSubmit} className="flex justify-center items-center ">
                    <div>
                        <label htmlFor="branchName" className=" ml-3 mb-2 block   text-sm text-white">
                            Şube Adı
                        </label>
                        <input
                            name="branchName"
                            type="text"
                            placeholder="Şube Adı"
                            className="w-full rounded-md p-3 text-black"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.branchName}
                            required
                        />
                        {formik.touched.branchName && formik.errors.branchName ? (
                            <div className={"text-white"}>{formik.errors.branchName}</div>) : null}
                        <label htmlFor="phone" className=" ml-3 block mb-1 mt-1   text-sm text-white">
                            Telefon Numarası
                        </label>
                        <PhoneInput
                            name="phoneNumber"
                            placeholder="Telefon numaranız"
                            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border  p-3 text-sm bg-gray-50"
                            onChange={value => formik.setFieldValue('phone', value, true)}
                            defaultCountry={'TR'}
                        />
                        {formik.touched.phone && formik.errors.phone ? (
                            <div className={"text-white"}>{formik.errors.phone}</div>) : null}


                        <label htmlFor="city" className=" ml-3 block   text-sm text-white">
                            İl
                        </label>
                        <select
                            name="city"
                            value={formik.values.city}
                            onChange={(e) => {
                                formik.handleChange(e);
                                handleIlChange(e);
                            }}
                            className="mt-2 block w-full rounded-lg border border-gray-100  px-2 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            onBlur={formik.handleBlur}
                            >
                            <option value="">İl Seçiniz</option>
                            {ilIlceData.map((item, index) => (
                                <option key={index} value={item.il}>{item.il}</option>))}
                        </select>
                        {formik.touched.city && formik.errors.city ?
                            <div className={"text-white"}>{formik.errors.city}</div> : null}

                        <label htmlFor="district" className=" ml-3  mt-1 block text-sm  text-sm text-white">
                            İlçe
                        </label>
                        <select
                            disabled={!selectedIl}
                            name="district"
                            value={formik.values.district}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-2 block w-full rounded-lg border border-gray-100  px-2 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">

                            >
                            <option value="">İlçe Seçiniz</option>
                            {ilceler.map((ilce, index) => (<option key={index} value={ilce}>{ilce}</option>))}
                        </select>
                        {formik.touched.district && formik.errors.district ?
                            <div className={"text-white"}>{formik.errors.district}</div> : null}

                        <div className={"grid grid-cols-2 gap-2"}>
                            <div>
                                <label htmlFor="street"
                                       className=" ml-3 block mb-1 mt-1   text-sm text-white">
                                    Cadde
                                </label>
                                <input
                                    name="street"
                                    type="text"
                                    placeholder="Cadde"
                                    className="w-full rounded-md p-3 text-black"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.street}
                                    required
                                />
                                {formik.touched.street && formik.errors.street ? (
                                    <div className={"text-white"}>{formik.errors.street}</div>) : null}
                            </div>

                            <div>
                                <label htmlFor="buildingNumber"
                                       className=" ml-3 block mb-1 mt-1   text-sm text-white">
                                    Bina numarası
                                </label>
                                <input
                                    name="buildingNumber"
                                    type="text"
                                    placeholder="Bina numarası"
                                    className="w-full rounded-md p-3 text-black"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.buildingNumber}
                                    required
                                />
                                {formik.touched.buildingNumber && formik.errors.buildingNumber ? (
                                    <div className={"text-white"}>{formik.errors.buildingNumber}</div>) : null}
                            </div>

                            <div>
                                <label htmlFor="apartmentNumber"
                                       className=" ml-3 block mb-1 mt-1   text-sm text-white">
                                    Daire Numarası
                                </label>
                                <input
                                    name="apartmentNumber"
                                    type="text"
                                    placeholder="Daire Numarası"
                                    className="w-full rounded-md p-3 text-black"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.apartmentNumber}
                                    required
                                />
                                {formik.touched.apartmentNumber && formik.errors.apartmentNumber ? (
                                    <div className={"text-white"}>{formik.errors.apartmentNumber}</div>) : null}
                            </div>


                        </div>
                        <div>
                            <label htmlFor="openAddress"
                                   className=" ml-3 block mb-1 mt-1   text-sm text-white">
                                Açık adress
                            </label>
                            <input
                                name="openAddress"
                                type="text"
                                placeholder="Açık adress"
                                className="w-full rounded-md p-3 text-black"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.openAddress}
                                required
                            />
                            {formik.touched.openAddress && formik.errors.openAddress ? (
                                <div className={"text-white"}>{formik.errors.openAddress}</div>) : null}
                        </div>

                        <button
                            disabled={!(formik.isValid && formik.dirty)}
                            type="submit"
                            className={`mt-2 w-full rounded-xl py-[12px] text-base font-medium
                                ${addBranchMutation.isLoading ? 'bg-brand-300' : 
                                'bg-brand-500 hover:bg-brand-600'} text-white`}
                        >
                            {addBranchMutation.isLoading? "Şube oluşturuluyor": "Oluştur"}
                        </button>
                    </div>
                </form>

            </motion.div>
            <div className="flex flex-col justify-center items-center text-white p-4 ease-in-out duration-100 hover:border-white hover:border-2 rounded-md cursor-pointer mt-4" onClick={() => setIsOpen(!isOpen)}>


                        <p>Yeni Şube Eklemek İster Misiniz ?</p>
                        <button
                                className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"/>
                            </svg>
                        </button>

            </div>
        </div>
    </div>);
};

export default AddBranchBanner;
