import React, {useState} from 'react';
import Spinner from "../../../../components/Spinner/Spinner";


const Addition = ({orders, isOrderLoading}) => {


    const [openIndex, setOpenIndex] = useState(null);




    return (
        <div className={"p-2.5 bg-white rounded drop-shadow-lg"}>
            <div className={"text-lg font-bold text-navy-700 dark:text-white mt-2"}>
                siparisler
            </div>
            <div className="mt-5">
                <Spinner loading={isOrderLoading}/>
                {orders && orders.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            <div key={index} className="py-4">
                                <div className="cursor-pointer"
                                     onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                                    <h3 className="text-lg font-semibold">{order.createTime}</h3>
                                    <div className="text-sm text-gray-600">Total Amount: ${order.totalAmount}</div>
                                    <div
                                        className="text-sm text-gray-600">Status: {order.status === 1 ? 'Active' : 'Inactive'}</div>
                                </div>
                                {openIndex === index && (
                                    <div className="mt-4">
                                        <span className="font-medium">Order Details:</span>
                                        <ul className="list-disc pl-5">
                                            {order.orderDetails.map((detail, detailIndex) => (
                                                <li key={detailIndex}>
                                                    {detail.product.name} (Quantity: {detail.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Bekleyen bir sipariş yok.</div>
                )}
            </div>

        </div>
    );
};

export default Addition;
