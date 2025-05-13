import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';

interface Order {
    orderId: string;
    orderedAt: string;
    status: number;
    claimCode: string;
    discountApplied: number;
    user: {
        id: string;
        userName: string;
        email: string;
    };
    items: {
        title: string;
        quantity: number;
        unitPrice: number;
    }[];
}

const AllOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllOrders = async () => {
        try {
            const res = await axiosInstance.get('/Orders/all');
            setOrders(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch all orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const statusLabels = ['Pending', 'Cancelled', 'Fulfilled'];

    const processOrder = async (claimCode: string) => {
        try {
            await axiosInstance.post(`/Orders/process/${claimCode}`);
            alert(`Order with claim code ${claimCode} processed.`);
            fetchAllOrders();
        } catch (err) {
            alert('Failed to process order.');
        }
    };

    if (loading) return <div className="text-center p-6 text-white bg-gray-800 min-h-screen">Loading all orders...</div>;
    if (error) return <div className="text-center text-red-500 bg-gray-800 min-h-screen">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-800 text-white px-6 py-10">
            <h2 className="text-4xl font-bold text-center mb-10">All Orders (Staff View)</h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-300">No orders found.</p>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                            <div className="mb-4">
                                <div className="text-sm text-gray-400">Order ID</div>
                                <div className="text-lg font-semibold">{order.orderId}</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Status:</span>{' '}
                                    <span className="font-medium">{statusLabels[order.status]}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Ordered At:</span>{' '}
                                    {new Date(order.orderedAt).toLocaleString()}
                                </div>
                                <div>
                                    <span className="text-gray-400">Claim Code:</span> {order.claimCode}
                                </div>
                                <div>
                                    <span className="text-gray-400">Discount:</span> ${order.discountApplied.toFixed(2)}
                                </div>
                                <div>
                                    <span className="text-gray-400">User:</span>{' '}
                                    {order.user.userName} ({order.user.email})
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-gray-400 font-medium mb-1">Items:</div>
                                <ul className="list-disc ml-5 space-y-1">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.title} - Qty: {item.quantity} - ${item.unitPrice.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {order.status !== 1 && order.status !== 2 && (
                                <button
                                    onClick={() => processOrder(order.claimCode)}
                                    className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-green-700 transition"
                                >
                                    Process Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllOrders;
