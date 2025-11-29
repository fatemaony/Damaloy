import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';
import { Trash2, Loader2 } from 'lucide-react';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = useAxios();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/products');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
          const response = await axiosInstance.delete(`/api/products/${id}`);
          if (response.data.success) {
            Swal.fire(
              'Deleted!',
              'Product has been deleted.',
              'success'
            );
            // Remove from local state
            setProducts(products.filter(product => product.id !== id));
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire(
            'Error!',
            'Failed to delete product.',
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
        <button onClick={fetchProducts} className="mt-4 btn btn-primary btn-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">All Products</h2>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table w-full">
            {/* head */}
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Store Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <th>{index + 1}</th>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-box w-12 h-12">
                          <img src={product.image || "https://placehold.co/100"} alt={product.name} />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium text-gray-900">{product.name}</td>
                    <td className="text-gray-600">{product.store_name || 'N/A'}</td>
                    <td className="font-semibold text-primary">${product.price}</td>
                    <td>
                      <span className={`badge ${product.quantity > 0 ? 'badge-success text-white' : 'badge-error text-white'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
                        title="Delete Product"
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

export default AllProducts;
