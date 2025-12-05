import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const password = watch('password');

  
  const uploadImageToImgBB = async (imageFile) => {
    if (!imageFile) return ''; 
    
    if (!IMGBB_API_KEY) {
      throw new Error('Image upload service is not configured properly.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!imgbbResponse.ok) {
        throw new Error('ImgBB upload failed: ' + imgbbResponse.statusText);
      }

      const imgbbData = await imgbbResponse.json();
      
      if (imgbbData.success) {
        return imgbbData.data.url;
      } else {
        throw new Error('ImgBB response success is false: ' + imgbbData.error.message);
      }
    } catch (error) {
      console.error('Image Upload Error:', error);
      throw new Error('Failed to upload image. Please check the file and try again.');
    }
  };

  // This function orchestrates the signup process
  const onSubmit = async (data) => { 
    setIsSubmitting(true);
    let photoUrl = '';

    try {
      const imageFile = data.photo[0]; 
      
      if (imageFile) {
        photoUrl = await uploadImageToImgBB(imageFile); 
      }

      
      const result = await createUser(data.email, data.password);
      
      
      const userData = {
        name: data.fullName,
        email: data.email,
        photo_url: photoUrl, 
        role: 'user'
      };


      const backendResponse = await axiosInstance.post('/api/users', userData);
      
      if (!backendResponse.data.success) {
        throw new Error('Failed to create user in database');
      }
      
      Swal.fire({
        title: 'Welcome! 🎉',
        text: 'Account created successfully.',
        icon: 'success',
        confirmButtonText: 'Go to Home',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn btn-primary' }

      }).then(() => {
        navigate('/');
      });

    } catch (error) {
      console.error('Signup Error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Signup failed',
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) { 
        setPhotoPreview('');
        setError('photo', {
          type: 'manual',
          message: 'File size must be under 2MB.'
        });
        return;
      }

      // Create a local preview URL
      const localUrl = URL.createObjectURL(file);
      setPhotoPreview(localUrl);
      clearErrors('photo');
    } else {
      setPhotoPreview('');
      clearErrors('photo');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen py-10"> 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md px-5 shadow-2xl bg-base-100" 
      >
        <div className="card-body">
          <h1 className="text-3xl font-bold text-secondary text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-3">Join us today for delicious food!</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  // Added pl-10 for icon padding
                  className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`} 
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters'
                    }
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="text-error text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Photo Upload Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Profile Photo (Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className={`file-input file-input-bordered file-input-primary w-full ${errors.photo ? 'input-error' : ''}`}
                  {...register('photo', {
                    onChange: handlePhotoChange,
                  })}
                />
              </div>
              {errors.photo && (
                <p className="text-error text-sm mt-1">{errors.photo.message}</p>
              )}
              {photoPreview && (
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="h-16 w-16 object-cover rounded-full border border-primary"
                  />
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting} 
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </div>
          </form>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;