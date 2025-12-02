import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import useAuth from '../../../Hooks/useAuth';
import { Loader2 } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await axiosInstance.get(`/api/orders/${user.id || user.user_id}`);
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosInstance, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'badge-success text-white';
      case 'pending': return 'badge-warning text-gray-800';
      case 'cancelled': return 'badge-error text-white';
      case 'delivered': return 'badge-success text-white';
      default: return 'badge-ghost text-gray-600';
    }
  };

  return (
    <div className="p-6 min-h-screen bg-base-200">
      <h2 className="text-3xl font-bold mb-8 font-aladin text-primary">My Orders</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-base-content">Order #{order.id}</h3>
                <span className={`px-4 py-1 rounded-full text-sm font-medium capitalize badge ${getStatusColor(order.order_status)}`}>
                  {order.order_status}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                {new Date(order.created_at).toLocaleDateString()}
              </p>

              <ul className="space-y-2 mb-6 ml-4 list-disc text-base-content">
                {order.items && order.items.map((item, index) => (
                  <li key={index} className="text-lg">
                    {item.quantity} x {item.product_name} - ${parseFloat(item.price).toFixed(2)} each
                  </li>
                ))}
              </ul>

              <div className="flex justify-end">
                <p className="text-xl font-bold text-primary">
                  Total: ${parseFloat(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
