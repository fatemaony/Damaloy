import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxios from '../../Hooks/useAxios';
import Swal from 'sweetalert2';
import { Loader2, Star, ShoppingCart, MapPin, Phone, Mail, Trash2 } from 'lucide-react';
import useAuth from '../../Hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, reviewsRes, historyRes] = await Promise.all([
          axiosInstance.get(`/api/products/${id}`),
          axiosInstance.get(`/api/reviews/${id}`),
          axiosInstance.get(`/api/products/${id}/price-history`)
        ]);

        if (productRes.data.success) {
          setProduct(productRes.data.data);
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
        }
        if (historyRes.data.success) {
          // Format date for chart
          const formattedHistory = historyRes.data.data.map(item => ({
            ...item,
            date: new Date(item.changed_at).toLocaleDateString()
          }));
          setPriceHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        Swal.fire('Error', 'Failed to load product details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, axiosInstance]);

  // Fetch user role and check for existing review
  useEffect(() => {
    const checkUserStatus = async () => {
      if (user?.email) {
        try {
          // Get user details to check role
          const userRes = await axiosInstance.get(`/api/users/email/${user.email}`);
          if (userRes.data.success) {
            setUserRole(userRes.data.data.role);
            const userId = userRes.data.data.id;
            setCurrentUserId(userId);

            // Check if user has already reviewed
            const existing = reviews.find(r => r.user_id === userId);
            if (existing) {
              setUserReview(existing);
              setRating(existing.rating);
              setComment(existing.comment);
            }
          }
        } catch (err) {
          console.error("Error checking user status:", err);
        }
      }
    };

    if (reviews.length > 0 || user) {
      checkUserStatus();
    }
  }, [user, reviews, axiosInstance]);

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => Math.min(prev + 1, product.quantity));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const addToCart = async (redirect = false) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add items to cart',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        confirmButtonColor: '#0f6523ff'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signin');
        }
      });
      return;
    }

    try {
      let userId = currentUserId;
      // Fallback if currentUserId hasn't been set yet (though it should be by useEffect)
      if (!userId && user.email) {
        const userRes = await axiosInstance.get(`/api/users/email/${user.email}`);
        if (userRes.data.success) {
          userId = userRes.data.data.id || userRes.data.data.user_id;
        }
      }

      if (!userId) {
        Swal.fire('Error', 'User identification failed. Please try logging in again.', 'error');
        return;
      }

      const response = await axiosInstance.post('/api/cart/add', {
        product_id: product.id,
        user_id: userId,
        quantity: quantity
      });

      if (response.data.success) {
        if (redirect) {
          navigate('/dashboard/user/myCart');
        } else {
          await Swal.fire({
            title: `${product.name} Added to Cart!`,
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire('Error', 'Failed to add item to cart', 'error');
    }
  };

  const handleBuyNow = () => {
    addToCart(true);
  };

  const handleAddToCart = () => {
    addToCart(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire('Login Required', 'Please login to add a review.', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      let response;
      if (userReview) {
        response = await axiosInstance.put(`/api/reviews/${userReview.id}`, {
          rating,
          comment,
          user_id: currentUserId
        });
      } else {
        response = await axiosInstance.post('/api/reviews', {
          product_id: id,
          user_id: currentUserId,
          rating,
          comment
        });
      }

      if (response.data.success) {
        Swal.fire({
            title: 'Review Added!',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });

        if (userReview) {
          setReviews(reviews.map(r => r.id === userReview.id ? response.data.data : r));
        } else {
          setReviews([response.data.data, ...reviews]);
        }

        setUserReview(response.data.data);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f6523ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/api/reviews/${reviewId}`, {
            data: { user_id: currentUserId }
          });

          if (response.data.success) {
            Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
            setReviews(reviews.filter(r => r.id !== reviewId));
            setUserReview(null);
            setComment('');
            setRating(5);
          }
        } catch (error) {
          console.error("Error deleting review:", error);
          Swal.fire('Error', 'Failed to delete review.', 'error');
        }
      }
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Product Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">
            <div className="flex flex-col gap-4">

              {/* Image */}
              <div className="flex justify-center items-center rounded-lg w-full h-[200px]">
                <img
                  src={product.image || "https://placehold.co/400"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Price History Graph */}
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold mb-4 text-center">Price History</h3>
                {priceHistory.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={priceHistory}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 10 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-400">
                    No price history available
                  </div>
                )}
              </div>

            </div>

            {/* Details */}
            <div className="flex flex-col justify-between mb-10 px-10">
              <div>
                <h1 className=" text-2xl lg:text-4xl font-bold text-secondary mb-4">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
                </div>

                <div className="text-3xl font-bold text-primary mb-6">
                  ${product.price} <span className="text-sm font-normal text-gray-500">/ {product.unit}</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description || "No description available."}
                </p>

                {/* Seller Info */}
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Sold by: {product.store_name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {product.location}</div>
                    <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {product.phone}</div>
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {product.seller_email}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('dec')}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >-</button>
                    <span className="px-4 py-1 font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('inc')}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity >= product.quantity}
                    >+</button>
                  </div>
                  <span className="text-sm text-gray-500">{product.quantity} available</span>
                </div>

                <div className='flex items-center gap-10'>
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-primary w-full md:w-auto gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-outline btn-primary w-full md:w-auto gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add/Edit Review */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">
                {userReview ? 'Update Your Review' : 'Write a Review'}
              </h3>

              {!user ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Please login to write a review.</p>
                  <button onClick={() => navigate('/signin')} className="btn btn-primary btn-sm">Login</button>
                </div>
              ) : userRole !== 'user' ? (
                <div className="alert alert-warning text-sm">
                  Only customers can leave reviews.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`focus:outline-none transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      className="textarea textarea-bordered w-full h-32"
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={submittingReview}
                  >
                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : (userReview ? 'Update Review' : 'Submit Review')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Customer Reviews ({reviews.length})</h3>
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start space-x-4">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img src={review.user_photo || "https://placehold.co/100"} alt={review.user_name} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                              {/* Show delete button only if it's the logged-in user's review */}
                              {currentUserId === review.user_id && (
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Delete Review"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex text-yellow-400 my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-gray-600 mt-2">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;