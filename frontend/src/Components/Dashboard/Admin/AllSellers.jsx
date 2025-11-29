import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';
import { Trash2, Loader2 } from 'lucide-react';

const AllSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = useAxios();

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/sellers', { params: { status: 'approved' } });
      if (response.data.success) {
        setSellers(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError("Failed to load sellers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [axiosInstance]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/api/sellers/${id}`);
          if (response.data.success) {
            Swal.fire(
              'Deleted!',
              'Seller has been deleted.',
              'success'
            );
            // Remove from local state
            setSellers(sellers.filter(seller => seller.id !== id));
          }
        } catch (error) {
          console.error("Error deleting seller:", error);
          Swal.fire(
            'Error!',
            'Failed to delete seller.',
            'error'
          );
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
        <button onClick={fetchSellers} className="mt-4 btn btn-primary btn-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">All Sellers</h2>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table w-full">
            {/* head */}
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Store Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Product Items</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No sellers found.
                  </td>
                </tr>
              ) : (
                sellers.map((seller, index) => (
                  <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                    <th>{index + 1}</th>
                    <td className="font-medium text-gray-900">{seller.store_name}</td>
                    <td className="text-gray-600">{seller.seller_email}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm">{seller.store_category}</span>
                    </td>
                    <td className="text-center font-semibold">{seller.product_count || 0}</td>
                    <td className="text-gray-600">{seller.phone}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(seller.id)}
                        className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
                        title="Delete Seller"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllSellers;
