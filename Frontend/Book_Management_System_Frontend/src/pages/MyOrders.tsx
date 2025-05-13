import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import Review from '../components/Review';

interface Order {
  orderId: string;
  items: {
    bookId: string;
    quantity: number;
    title:string;
  }[];
  status: number;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string| null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/Orders/my');
        console.log("🚀 ~ fetchOrders ~ res:", res)
        setOrders(res.data);
      } catch {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Order #{order.orderId}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 2 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {order.status === 2 ? 'Delivered' : 'Processing'}
              </span>
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
                      onClick={() => setSelectedBook(item.bookId!)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                    >
                      Write Review
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {selectedBook && (
        <Review bookId={selectedBook}  closeModal={closeModal} />
      )}
    </div>
  );
};

export default MyOrders;
