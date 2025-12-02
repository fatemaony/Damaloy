import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, ShoppingCart, Plus, Minus, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import useAxios from '../../../Hooks/useAxios';

const MyCart = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchCart();
    }
  }, [user, axiosInstance]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      let userId = user.id;
      if (!userId && user.email) {
        const userRes = await axiosInstance.get(`/api/users/email/${user.email}`);
        if (userRes.data.success) {
          userId = userRes.data.data.id || userRes.data.data.user_id;
        }
      }

      if (userId) {
        const response = await axiosInstance.get(`/api/cart/${userId}`);
        if (response.data.success) {
          setCartItems(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(id);
    try {
      const response = await axiosInstance.put(`/api/cart/${id}`, { quantity: newQuantity });
      if (response.data.success) {
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      Swal.fire('Error', 'Failed to update quantity', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteItem = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Remove this item from your cart?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#12722dff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/api/cart/${id}`);
          if (response.data.success) {
            setCartItems(prev => prev.filter(item => item.id !== id));
            Swal.fire('Removed!', 'Item has been removed.', 'success');
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire('Error', 'Failed to remove item', 'error');
        }
      }
    });
  };

  const handleClearCart = async () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: "This will remove all items from your cart!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#12722dff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let userId = user.id;
          if (!userId && user.email) {
            const userRes = await axiosInstance.get(`/api/users/email/${user.email}`);
            if (userRes.data.success) {
              userId = userRes.data.data.id || userRes.data.data.user_id;
            }
          }

          if (userId) {
            const response = await axiosInstance.delete(`/api/cart/clear/${userId}`);
            if (response.data.success) {
              setCartItems([]);
              Swal.fire('Cleared!', 'Your cart has been cleared.', 'success');
            }
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
          Swal.fire('Error', 'Failed to clear cart', 'error');
        }
      }
    });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 lg:px-15 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-base-content font-aladin">
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="btn btn-outline btn-error btn-sm"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-xl shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl mb-6">Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-base-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-24 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "https://placehold.co/150"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between h-full w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-base-content mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Each ${item.price}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-base-content">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-error hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex justify-end mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 bg-base-200 rounded-full px-2 py-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updating === item.id}
                          className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 disabled:opacity-50 transition-colors text-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="w-8 h-8 rounded-full bg-base-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 transition-colors text-base-content"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-base-100 rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-base-content mb-6 font-aladin">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 text-lg">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between font-bold text-2xl text-base-content">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="w-full btn btn-primary text-white text-lg font-bold py-3 h-auto shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2 justify-center">
                  <CreditCard className="w-6 h-6" />
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCart;
