import React, { useState, useEffect } from 'react';
import axiosInstance from '../service/axiosInstance';
import { toast } from 'react-toastify';

interface CartItem {
  cartId: number;
  quantity: number;
  book: Book;
}

interface Book {
  title: string;
  price: number;
  bookId: string;
  discount: {
    bookDiscounts: Discount[];
  };
}

interface Discount {
  bookDiscountId: string;
  bookId: string;
  discountPercentage: number;
  startAt: string;
  endAt: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successfulOrdersCount, setSuccessfulOrdersCount] = useState<number>(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axiosInstance.get('/Cart/getCarts');
        setCartItems(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    const fetchSuccessfulOrdersCount = async () => {
      try {
        const response = await axiosInstance.get('/User/getUser');
        setSuccessfulOrdersCount(response.data.successfulOrdersCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      }
    };

    fetchSuccessfulOrdersCount();
  }, []);

  const handleRemove = async (cartId: number) => {
    try {
      await axiosInstance.delete(`/Cart/delete/${cartId}`);
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axiosInstance.post('/Orders/create', { items: cartItems });
      toast.success('Order placed successfully!');
      setCartItems([]);
    } catch (err) {
      console.error('Failed to place order:', err);
      toast.error('Failed to place order.');
    }
  };

  const getDiscountedPrice = (book: Book) => {
    const discount = book.discount?.bookDiscounts?.[0];
    if (discount) {
      return book.price - (book.price * discount.discountPercentage) / 100;
    }
    return book.price;
  };

  const totalBookQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isEligibleFor5Percent = totalBookQuantity >= 5;
  const isEligibleFor10Percent = successfulOrdersCount >= 10;

  const getTotalPrice = () => {
    let total = cartItems.reduce(
      (sum, item) => sum + getDiscountedPrice(item.book) * item.quantity,
      0
    );

    if (isEligibleFor5Percent) {
      total *= 0.95; // Apply 5% discount
    }

    if (isEligibleFor10Percent) {
      total *= 0.90; // Apply additional 10% discount
    }

    return total;
  };

  if (loading) return <div className="text-center p-6 text-black">Loading...</div>;

  if (error)
    return <div className="text-center p-6 text-red-600 text-lg">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl text-black font-semibold mb-4 text-center">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center text-black">Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => {
            const book = item.book;
            const discount = book.discount?.bookDiscounts?.[0];
            const isDiscounted = !!discount;
            const discountPercentage = discount?.discountPercentage || 0;
            const discountedPrice = getDiscountedPrice(book);
            const totalPrice = discountedPrice * item.quantity;

            return (
              <div
                key={item.cartId}
                className="relative flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
              >
                {isDiscounted && (
                  <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                    {discountPercentage}% OFF
                  </div>
                )}
                <div>
                  <h3 className="text-lg text-black font-medium">{book.title}</h3>
                  {isDiscounted ? (
                    <div className="text-black">
                      <p>
                        Price:{' '}
                        <span className="line-through text-gray-500">
                          ${book.price.toFixed(2)}
                        </span>{' '}
                        <span className="text-emerald-600 font-semibold">
                          ${discountedPrice.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-black">Price: ${book.price.toFixed(2)}</p>
                  )}
                  <p className="text-black">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.cartId)}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-right text-lg text-black font-semibold mt-6">
            Total: ${getTotalPrice().toFixed(2)}
          </div>

          <div className="mt-6 text-black text-sm text-center">
            {isEligibleFor5Percent ? (
              <p className="text-emerald-600 font-medium">
                ✅ You qualify for a 5% discount on orders of 5 or more books!
              </p>
            ) : (
              <p>
                📚 Add {5 - totalBookQuantity} more book(s) to qualify for a 5% discount.
              </p>
            )}
            <p className="mt-2">
              🧾 You have completed {successfulOrdersCount} successful order(s).
              {isEligibleFor10Percent ? (
                <span className="text-emerald-600 font-medium"> 🎉 You qualify for a 10% loyalty discount!</span>
              ) : (
                <span> Only {10 - successfulOrdersCount} more to unlock a 10% loyalty discount!</span>
              )}
            </p>
          </div>

          <div className="text-right mt-4">
            <button
              onClick={handlePlaceOrder}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
