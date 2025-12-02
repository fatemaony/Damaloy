import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';
import { Trash2, Loader2 } from 'lucide-react';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    const productName = product.name?.toLowerCase() || '';
    const storeName = product.store_name?.toLowerCase() || '';
    return productName.includes(term) || storeName.includes(term);
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-primary">All Products</h2>
          {/* Search Section */}
          <div className="relative w-full max-w-xs mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search by product or store..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

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
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                currentItems.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <th>{indexOfFirstItem + index + 1}</th>
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

          {/* Pagination Controls */}
          {filteredProducts.length > itemsPerPage && (
            <div className="flex justify-center py-4">
              <div className="btn-group">
                <button
                  className="btn btn-sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
