import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import Review from '../Components/Review';

interface Order {
  orderId: string;
  items: {
    bookId: string;
    quantity: number;
    title: string;
  }[];
  status: number;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/Orders/my');
      setOrders(res.data);
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' };
      case 1:
        return { label: 'Cancelled', classes: 'bg-red-100 text-red-800' };
      case 2:
        return { label: 'Fulfilled', classes: 'bg-green-100 text-green-800' };
      default:
        return { label: 'Unknown', classes: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await axiosInstance.put(`/Orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : error ? (
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Order #{order.orderId}
                </h3>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusLabel(order.status).classes}`}>
                    {getStatusLabel(order.status).label}
                  </span>
                  {order.status === 0 && (
                    <button
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <ul className="space-y-4">
                {order.items.map((item, index) => (
                  <li
                    key={`${order.orderId}-${item.bookId}-${index}`}
                    className="flex justify-between items-center border-b pb-4 last:border-b-0"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">{item.title || 'Unknown Book'}</p>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    {order.status === 2 && (
                      <button
                        onClick={() => setSelectedBook(item.bookId)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                      >
                        Write Review
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <Review bookId={selectedBook} closeModal={closeModal} />
      )}
    </div>
  );
};

export default MyOrders;