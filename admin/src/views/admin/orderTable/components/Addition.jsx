import React, {useState} from 'react';
import Spinner from "../../../../components/Spinner/Spinner";
import {FiChevronDown} from "react-icons/fi";

const Addition = ({setPaymentModal, orders, isOrderLoading,submitQuickPayment}) => {


    const [openIndex, setOpenIndex] = useState(null);

    const totalAmount = orders?.reduce((acc, order) => {
        return acc + order.totalAmount;
    }, 0); // Başlangıç değeri 0

    return (<div className={"px-2.5  bg-white h-full rounded drop-shadow-lg"}>
        {/*<div className={"text-lg font-bold text-navy-700 dark:text-white mt-2"}>
            siparisler
        </div>*/}
        <div className="mt-2n">
            <Spinner loading={isOrderLoading}/>
            {orders && orders.length > 0 ? (<div className="divide-y divide-gray-200">
                    {orders.map((order, index) => (<div key={index} className="py-4">
                            <div
                                className="cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b hover:bg-gray-100 transition duration-300"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}>

                                <div className="flex items-center justify-between w-full md:w-auto space-x-4">
                                    <FiChevronDown
                                        className={`${openIndex === index ? 'rotate-180' : ''} transition-transform duration-300`}/>
                                    <span className="text-lg font-semibold">{index + 1}</span>
                                </div>

                                <div
                                    className="flex flex-col md:flex-row md:items-center md:space-x-12 mt-2 md:mt-0 space-y-2 md:space-y-0 w-full">
                                    <h3 className="text-lg font-semibold">{new Date(order.createTime).toLocaleDateString()}</h3>
                                    <div className="text-sm text-gray-600">Toplam Tutar: ₺{order.totalAmount}.00</div>
                                    <div className="text-sm text-gray-600">
                                        Durumu: &nbsp;
                                        <span
                                            className={`font-semibold ${order.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                                            {order.status === 1 ? ' Aktif' : ' Pasif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {openIndex === index && (<div className="mt-4">
                                {/* <span className="font-medium">Sipariş Detayları:</span>*/}
                                {/*<ul className="list-disc pl-5">
                                            {order.orderDetails.map((detail, detailIndex) => (
                                                <li key={detailIndex}>
                                                    {detail.product.name} (Quantity: {detail.quantity})
                                                </li>
                                            ))}
                                        </ul>*/}
                                <div className="border-2 p-2 rounded-xl">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {order?.orderDetails?.map((detail, detailIndex) => (<li className="flex py-6">
                                            <div
                                                className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md  border-gray-200">
                                            <img
                                                    src={detail.product.images[0]}
                                                    alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                                                    className="h-full w-full object-cover object-center"/>
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div
                                                        className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                            <a href="#">{detail.product.name} </a>
                                                        </h3>
                                                        <p className="ml-4">₺{detail.product.price}.00</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{detail.product.description}</p>
                                                </div>
                                                <div
                                                    className="flex flex-1 items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty {detail.quantity}</p>

                                                    <div className="flex">
                                                        <button type="button"
                                                                className="font-medium text-indigo-600 hover:text-indigo-500">Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>))}

                                    </ul>
                                </div>

                            </div>)}
                        </div>
                    ))}

                    <div className="sticky bottom-0  h-full w-full border bg-white p-6 rounded-lg shadow-md md:mt-0">
                        {/*<div className="mb-2 flex justify-between">
                                    <p className="text-gray-700">Ara Toplam</p>
                                    <p className="text-gray-700">₺129.99</p>
                                </div>*/}
                        {/*   <hr className="my-4"/>*/}
                        <div className="flex justify-between">
                            <p className="text-lg font-bold">Toplam</p>
                            <div className="">
                                <p className="mb-1 text-lg font-bold">₺{totalAmount} TL</p>
                                <p className="text-sm text-gray-700">KDV dahil</p>
                            </div>
                        </div>
                        <div className={"grid grid-cols-2 gap-4"}>
                            <button
                                onClick={() => {
                                    setPaymentModal(true);
                                }}
                                className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                                Ödeme Yap
                            </button>
                            <button
                                onClick={submitQuickPayment}
                                className="mt-6 w-full rounded-md bg-red-500 py-1.5 font-medium text-blue-50 hover:bg-red-600">
                                Hızlı Ödeme Yap
                            </button>
                        </div>
                    </div>
                    </div>
            ) : (
                <div className="text-center text-gray-500">
                    Bekleyen bir sipariş yok.
            </div>

            )}
        </div>
    </div>);
};

export default Addition;
