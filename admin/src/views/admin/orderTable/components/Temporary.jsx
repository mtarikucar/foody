import React, {useState} from 'react';
import Switch from "../../../../components/switch";
import useAuth from "../../../../hooks/useAuth";
import {useParams} from "react-router-dom";
import {useWebSocket} from "../../../../context/socket/WebSocketContext";

const Temporary = ({addedProducts, setAddedProducts}) => {

    const socket = useWebSocket()
    const auth = useAuth();
    const {id} = useParams();
    const [isTotal, setIsTotal] = useState(true);
    // Function to increase product quantity
    const increaseProduct = (productName) => {
        const updatedProducts = addedProducts.map(p => {
            if (p.name === productName) {
                return {...p, quantity: p.quantity + 1}; // Assume you have a 'quantity' field
            }
            return p;
        });
        setAddedProducts(updatedProducts);
    };

// Updated decreaseProduct function
    const decreaseProduct = (productName) => {
        let index = addedProducts.findIndex(p => p.name === productName);
        if (index !== -1) {
            let newAddedProducts = [...addedProducts];
            let product = newAddedProducts[index];
            if (product.quantity > 1) {
                product.quantity -= 1;
            } else {
                newAddedProducts.splice(index, 1);
            }
            setAddedProducts(newAddedProducts);
        }
    };

    const aggregateProducts = () => {
        return Object.values(addedProducts.reduce((acc, product) => {
            if (!acc[product.name]) {
                acc[product.name] = {
                    product: [product.name, false],
                    count: 1,
                    price: product.price,
                    increase: () => increaseProduct(product.name),
                    decrease: () => decreaseProduct(product.name)
                };
            } else {
                acc[product.name].count++;
                acc[product.name].price += product.price;
                acc[product.name].product[0] = `${product.name} (${acc[product.name].count})`;
            }
            return acc;
        }, {}));
    };

    const tableDataCheck = isTotal ? aggregateProducts() : addedProducts.map(product => ({
        product: product.name,
        price: product.price,
        increase: () => increaseProduct(product.name),
        decrease: () => decreaseProduct(product.name)
    }));


    const calculateTotalPrice = (products) => {
        return products.reduce((total, product) => total + product.price, 0);
    };


    const calculateProductQuantities = (products) => {
        const productCount = products.reduce((acc, product) => {
            // Ürün ID'sine göre sayım yap
            if (acc[product.productId]) {
                acc[product.productId]++;
            } else {
                acc[product.productId] = 1;
            }
            return acc;
        }, {});

        // productCount nesnesini OrderProductRequest listesine dönüştür
        return Object.entries(productCount).map(([productId, quantity]) => ({
            productId: productId, quantity: quantity
        }));
    }

    const handleSubmit = async () => {
        try {
            const productRequests = calculateProductQuantities(addedProducts);

            const saveOrder = {
                branchId: auth.branchId,
                tableId: id,
                totalAmount: calculateTotalPrice(addedProducts),
                discount: 0,
                status: 1,
                products: productRequests,
            };

            socket.send("/app/order/" + auth.branchId + "/" + id, {}, JSON.stringify(saveOrder));
            socket.send("/app/notification/" + auth.currentUser, {}, JSON.stringify({
                content: "Siparişiniz alınmıştır.", userId: auth.currentUser, createTimestamp: new Date().getTime()
            }));
            setAddedProducts([]);
        } catch (e) {
            console.log(e);
        }
    }

    return (<>

            <div className={"bg-white rounded drop-shadow-lg "}>
                <div
                    className={"flex justify-between items-center  p-2 drop-shadow-lg"}>
                    <span className={"flex justify-center items-center"}>

                    <span className={"mr-4"}>
                        {isTotal ? 'toplu' : 'parçalı'}
                    </span>
                    <Switch onClick={() => setIsTotal(!isTotal)}/>
                    </span>
                    <span className={"flex items-center justify-center"}>
                        siparişe eklenecek ürünler
                    </span>

                </div>

                {tableDataCheck.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b mb-2">
                        <span>{item.product}</span>
                        <div className={"flex justify-center items-center"}>
                            <span>{item.price} TL</span>
                            <div className={"ml-2"}>
                                <button onClick={item.increase}
                                        className="bg-green-500 text-white rounded-full m-2 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </button>
                                <button onClick={item.decrease}
                                        className="bg-red-500 text-white rounded-full m-2 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>))}
                <div className="flex justify-around items-center my-3">
                    <span className="h-5">
                        {addedProducts.length} tane urun eklendi
                    </span>
                    <span className="h-5">
                        Toplam Fiyat: {calculateTotalPrice(addedProducts)} TL
                    </span>
                </div>
                <div className={"m-2 w-full flex justify-center items-center "}>
                    <button
                        onClick={handleSubmit}
                        disabled={addedProducts.length === 0}
                        className={"bg-indigo-700   disabled:bg-opacity-50 text-white w-fit rounded drop-shadow-lg  p-2 my-2 "}>
                        onayla {calculateTotalPrice(addedProducts)}TL
                    </button>
                </div>
            </div>

        </>);
};

export default Temporary;
