
import {useQuery} from "react-query";
import {getFeatures} from "../../api/axios.js";

function ProductModal({id, imgSrc, name, price, ratings, description, showModal, setShowModal}) {

    const tailwindColors = [
        'bg-red-500',    // Kırmızı
        'bg-blue-500',   // Mavi
        'bg-green-500',  // Yeşil
        'bg-yellow-500', // Sarı
        'bg-purple-500', // Mor
        'bg-pink-500',   // Pembe
        'bg-indigo-500', // İndigo
        'bg-teal-500',   // Teal
        'bg-gray-500'    // Gri
    ];

    const {
        data: features, isLoading: isBranchLoading, isError: isBranchError, error: branchError
    } = useQuery(["features"], () => getFeatures(id), {});



    return (<div>
        <>
            {showModal ? (<>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 p-3  outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div
                            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}

                            {/*body*/}
                            <div className="flex justify-center">
                                <div
                                    className="block w-full rounded-lg bg-white shadow-lg dark:bg-neutral-700">
                                        <img
                                            className="rounded-t-lg w-full"
                                            src={imgSrc}
                                            alt=""/>
                                    <div className="mx-6 my-2">
                                        <div className='flex justify-between items-center mb-2'>
                                            <h5
                                                className=" text-xl font-medium  text-neutral-800 dark:text-neutral-50">
                                                {name}
                                            </h5>

                                            <p className="text-xl text-neutral-800 dark:text-neutral-50">
                                                ₺{price}.00
                                            </p>
                                        </div>

                                        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                                            {description}
                                        </p>

                                        <div className='flex flex-row gap-3 <'>
                                            {features?.data?.map((feature, id) => {
                                                const randomIndex = Math.floor(Math.random() * tailwindColors.length);
                                                const colorClass = tailwindColors[randomIndex];
                                                return (<span
                                                        key={id}
                                                        className={`inline-flex items-center gap-x-1.5 py-1.5 mb-2 px-3 rounded-lg text-xs font-medium ${colorClass} border ${colorClass} text-white`}>
                                                <span
                                                    className={`w-1.5 h-1.5 inline-block rounded-full bg-white`}
                                                >
                                                </span>
                                                        {feature.featureName}
                                                </span>
                                                );
                                            })}
                                        </div>


                                        <button
                                            className="text-white border-2 w-full bg-dynamic py-2 hover:text-dynamic  hover:bg-white hover:border-dinamic  rounded  background-transparent font-bold uppercase px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>

                                    </div>
                                </div>
                            </div>
                            {/*footer*/}

                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>) : null}
        </>

    </div>)
}

export default ProductModal;
