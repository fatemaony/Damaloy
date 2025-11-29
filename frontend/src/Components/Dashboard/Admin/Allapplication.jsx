import React, { useEffect, useState } from 'react';
import { Store, CheckCircle, XCircle, MapPin, Phone, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';

const Allapplication = () => {
  const [applications, setApplications] = useState([]);
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get('/api/sellers', { params: { exclude_status: 'approved' } });
      const data = response.data;

      if (data.success) {
        setApplications(data.data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newStatus} this application?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${newStatus} it!`
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.patch(`/api/sellers/${id}/status`, { status: newStatus });
        if (response.data.success) {
          if (newStatus === 'approved') {
            // Remove from local state if approved
            setApplications(apps => apps.filter(app => app.id !== id));
          } else {
            // Update status in local state if rejected
            setApplications(apps => apps.map(app =>
              app.id === id ? { ...app, status: newStatus } : app
            ));
          }

          Swal.fire(
            'Updated!',
            `Application has been ${newStatus}.`,
            'success'
          );
        }
      } catch (err) {
        console.error("Failed to update status", err);
        Swal.fire(
          'Error!',
          'Failed to update application status.',
          'error'
        );
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-4 font-semibold">
      {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
        <Store className="h-8 w-8" />
        Seller Applications
      </h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-secondary text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Store Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  <td className="p-4 font-bold text-gray-900">{app.store_name}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {app.store_category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {app.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {app.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                            ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'}`
                    }>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {app.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}

                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {applications.length > itemsPerPage && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, applications.length)} of {applications.length} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                                        ${currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`
                  }
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Allapplication;