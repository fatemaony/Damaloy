import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';
import Swal from 'sweetalert2';

const SignIn = () => {
  const navigate = useNavigate();
  const { signInUser, signInWithGoogle } = useAuth();
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm();

  // Standard Email/Password Login
  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await signInUser(email, password);

      Swal.fire({
        title: 'Welcome! 🎉',
        text: 'You have successfully logged in.',
        icon: 'success',
        confirmButtonText: 'Go to Home',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn btn-primary' }
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('root', {
        type: 'manual',
        message: getErrorMessage(error.code)
      });
    }
  };

  // Google Sign In with Database Sync
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const userData = {
        name: result.user.displayName || 'Google User',
        email: result.user.email,
        photo_url: result.user.photoURL || 'https://via.placeholder.com/150',
        role: 'user'
      };

      try {
        // Check if user exists
        const response = await axiosInstance.get(`/api/users/email/${userData.email}`);

        if (response.data.success) {
          // User exists, update their info to keep it fresh
          const existingUser = response.data.data;
          await axiosInstance.put(`/api/users/${existingUser.id}`, userData);
        }
      } catch (getError) {
        // If user doesn't exist (404), create them
        if (getError.response?.status === 404) {
          try {
            const newUser = await axiosInstance.post('/api/users', userData);
            console.log('New Google user created in backend:', newUser.data);
          } catch (createError) {
            console.error('Error creating Google user in backend:', createError);
          }
        }
      }

      Swal.fire({
        title: 'Welcome! 🎉',
        text: 'You have successfully logged in.',
        icon: 'success',
        confirmButtonText: 'Go to Home',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn btn-primary' }
      });
      navigate('/');

    } catch (error) {
      console.error('Google login error:', error);
      setError('root', {
        type: 'manual',
        message: 'Google Sign-In failed. Please try again.'
      });
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential': return 'Invalid email or password';
      case 'auth/user-not-found': return 'No account found with this email';
      case 'auth/wrong-password': return 'Incorrect password';
      case 'auth/invalid-email': return 'Invalid email address';
      case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later';
      default: return 'Login failed. Please try again';
    }
  };

  return (
    <div className="card bg-base-100 w-full mx-auto">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-center">Login now!</h1>
        {errors.root && (
          <div className="alert alert-error">
            <span>{errors.root.message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset space-y-2">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Email</span></label>
              <input
                type="email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Password</span></label>
              <input
                type="password"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
            </div>
            <div>
              <Link to="/forgot-password" className="link link-hover link-primary text-sm">Forgot password?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <p>
              Don't have an account? <Link className="link link-primary underline font-semibold" to="/signUp">Sign Up</Link>
            </p>
          </fieldset>
        </form>
        <div className="divider">OR</div>
        <button
          className="btn btn-outline w-full bg-white text-black border-gray-400 hover:bg-gray-50"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          {/* Google SVG Icon */}
          <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};
export default SignIn;