import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch orders',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [axiosInstance]);

  const handleApproveOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Approve Order?',
        text: "This will change the order status to 'confirmed'.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!'
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.patch(`/api/orders/${orderId}/status`, {
          status: 'confirmed'
        });

        if (response.data.success) {
          Swal.fire(
            'Approved!',
            'The order has been approved.',
            'success'
          );
          fetchOrders(); // Refresh list
        }
      }
    } catch (error) {
      console.error("Error approving order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to approve order',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-primary text-white';
      case 'pending': return 'bg-warning text-gray-800';
      case 'cancelled': return 'bg-error text-white';
      case 'delivered': return 'bg-success text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="p-6 min-h-screen bg-base-200">
      <h2 className="text-3xl font-bold mb-8 font-aladin text-secondary">All Orders</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-green-50 rounded-xl p-6 shadow-sm border"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                  <span className="text-sm text-gray-500">User: {order.user_name} ({order.user_email})</span>
                </div>
                <div className="flex items-center gap-3">
                  {order.order_status === 'pending' && (
                    <button
                      onClick={() => handleApproveOrder(order.id)}
                      className="btn btn-sm btn-primary text-white"
                    >
                      Approve
                    </button>
                  )}
                  <span className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
              </p>

              <ul className="space-y-2 mb-6 ml-4 list-disc text-gray-800">
                {order.items && order.items.map((item, index) => (
                  <li key={index} className="text-lg">
                    {item.quantity} x {item.product_name} - ${parseFloat(item.price).toFixed(2)} each
                  </li>
                ))}
              </ul>

              <div className="flex justify-end">
                <p className="text-xl font-bold text-gray-900">
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

export default AllOrders;
