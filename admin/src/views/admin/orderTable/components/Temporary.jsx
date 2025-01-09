import React, {useState} from 'react';
import Switch from "../../../../components/switch";
import useAuth from "../../../../hooks/useAuth";
import {useParams} from "react-router-dom";
import {useWebSocket} from "../../../../context/socket/WebSocketContext";
import {useQueryClient} from "react-query";
import { RiDeleteBin6Line } from "react-icons/ri";


const Temporary = ({addedProducts, setAddedProducts, reconnectWebSocket}) => {
    const socket = useWebSocket();
    const auth = useAuth();
    const {id} = useParams();
    const [isTotal, setIsTotal] = useState(true);
    const queryClient = useQueryClient();
    const increaseProduct = (productName) => {
        const updatedProducts = addedProducts.map(p =>
            p.name === productName ? {...p, quantity: p.quantity ? p.quantity + 1 : 1} : p
        );
        setAddedProducts(updatedProducts);
    };

    const decreaseProduct = (productName) => {
        const newAddedProducts = addedProducts.reduce((acc, product) => {
            if (product.name === productName) {
                if (product.quantity > 1) {
                    acc.push({...product, quantity: product.quantity - 1});
                }
            } else {
                acc.push(product);
            }
            return acc;
        }, []);
        setAddedProducts(newAddedProducts);
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

    const calculateTotalPrice = (products) => products.reduce((total, product) => total + product.price, 0);

    const calculateProductQuantities = (products) => {
        const productCount = products.reduce((acc, product) => {
            acc[product.productId] = acc[product.productId] ? acc[product.productId] + 1 : 1;
            return acc;
        }, {});
        return Object.entries(productCount).map(([productId, quantity]) => ({
            productId: productId,
            quantity: quantity
        }));
    };

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

            if (socket && !socket.connected) {
                await reconnectWebSocket(); // Reconnect WebSocket if not connected
            }

            if (socket) {
                socket.send(`/app/order/${auth.branchId}/${id}`, {}, JSON.stringify(saveOrder));
                socket.send(`/app/notification/${auth.currentUser}`, {}, JSON.stringify({
                    content: "Siparişiniz alınmıştır.",
                    userId: auth.currentUser,
                    createTimestamp: new Date().getTime()
                }));
                setAddedProducts([]);
                queryClient.invalidateQueries(['additionOrder']);
                queryClient.invalidateQueries(['tableOrder']);
            } else {
                console.error('WebSocket is not available.');
            }
        } catch (e) {
            console.log('Error during order submission:', e);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            {/* Header Section */}
            <div className="flex justify-between items-center p-2 border-b mb-4">
                <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 mr-4">
                {isTotal ? 'Toplu' : 'Parçalı'}
            </span>
                    <Switch onClick={() => setIsTotal(!isTotal)}/>
                </div>
                <span className="text-lg font-semibold text-gray-700">
            Siparişe Eklenecek Ürünler
        </span>
            </div>

            {/* Product List Section */}
            {tableDataCheck.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center p-3 border-b last:border-none hover:bg-gray-100 transition-colors duration-200"
                >
                    <span className="font-medium text-gray-700">{item.product}</span>
                    <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-600">{item.price} TL</span>
                        <div className="flex items-center ml-4 space-x-2">
                            <button
                                onClick={item.decrease}
                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                            >
                                <RiDeleteBin6Line/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Summary and Submit Section */}
            <div className="flex justify-between items-center mt-6">
        <span className="text-sm font-medium text-gray-600">
            {addedProducts.length} ürün eklendi
        </span>
                <span className="text-sm font-medium text-gray-600">
            Toplam Fiyat: {calculateTotalPrice(addedProducts)} TL
        </span>
            </div>

            <div className="mt-4 w-full flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={addedProducts.length === 0}
                    className="bg-indigo-700 disabled:bg-opacity-50 text-white font-medium rounded-lg px-6 py-2 shadow-md hover:bg-indigo-800 transition"
                >
                    Onayla {calculateTotalPrice(addedProducts)} TL
                </button>
            </div>
        </div>

    );
};

export default Temporary;
