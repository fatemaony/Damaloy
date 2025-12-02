import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';
import { useNavigate } from 'react-router';

const SellerApplication = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

 
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const response = await axiosInstance.get(`/api/users/email/${user.email}`);
          if (response.data.success) {
            setDbUser(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user, axiosInstance]);

  const displayName = dbUser?.name || user?.displayName;
  const displayEmail = dbUser?.email || user?.email;



  const onSubmit = async (data) => {
    if (!dbUser) {
      Swal.fire({
        title: 'Error',
        text: 'User data not loaded. Please try again.',
        icon: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const applicationData = {
        user_id: dbUser.id,
        seller_email: dbUser.email,
        store_name: data.storeName,
        store_category: data.storeCategory,
        store_description: data.storeDescription,
        location: data.location,
        phone: data.phone
      };

      const response = await axiosInstance.post('/api/sellers/', applicationData);

      if (response.data.success) {
        Swal.fire({
          title: 'Application Submitted! 🎉',
          text: 'Your application to become a seller is pending approval.',
          icon: 'success',
          confirmButtonText: 'Go to Home',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn btn-primary' }
        }).then(() => {
          navigate('/');
        });
      }
    } catch (error) {
      console.error('Application Error:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit application.',
        icon: 'error',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn btn-primary' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-2xl bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title text-primary lg:text-4xl text-2xl font-bold text-center justify-center mb-3">
            Become a Seller
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Fill out the form below to apply for a seller account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* User Details (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-gray-100"
                  readOnly
                  value={displayName}
                  {...register('name')}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-gray-100"
                  readOnly
                  value={displayEmail}
                  {...register('email')}
                />
              </div>
            </div>

            {/* Store Details */}
            <div className="flex item-center gap-5">
 
            <div className="form-control w-1/2 mb-4">
              <label className="label">
                <span className="label-text">Store Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your store name"
                className={`input input-bordered w-full ${errors.storeName ? 'input-error' : ''}`}
                {...register('storeName', { required: 'Store Name is required' })}
              />
              {errors.storeName && (
                <p className="text-error text-sm mt-1">{errors.storeName.message}</p>
              )}
            </div>

            <div className="form-control w-1/2 mb-4">
              <label className="label">
                <span className="label-text">Store Category</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.storeCategory ? 'select-error' : ''}`}
                {...register('storeCategory', { required: 'Please select a category' })}
              >
                <option value="">Select a category</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Grocery">Grocery</option>
                <option value="Departmental">Departmental</option>
                <option value="Super Market">Super Market</option>
                <option value="Fruits">Fruits</option>
                <option value="Meat">Meat</option>
                <option value="Other">Other</option>
              </select>
              {errors.storeCategory && (
                <p className="text-error text-sm mt-1">{errors.storeCategory.message}</p>
              )}
            </div>

            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Store Description</span>
              </label>
              <textarea
                className={`textarea textarea-bordered w-full h-24 ${errors.storeDescription ? 'textarea-error' : ''}`}
                placeholder="Describe your store..."
                {...register('storeDescription', { required: 'Description is required' })}
              ></textarea>
              {errors.storeDescription && (
                <p className="text-error text-sm mt-1">{errors.storeDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  placeholder="Store location"
                  className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && (
                  <p className="text-error text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="Contact number"
                  className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]*$/,
                      message: 'Invalid phone number'
                    }
                  })}
                />
                {errors.phone && (
                  <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerApplication;