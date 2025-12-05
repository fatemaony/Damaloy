import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const { name, image, price, average_rating, review_count, unit, store_category, discount } = product || {};
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const discountedPrice = discount ? (price - (price * discount / 100)).toFixed(2) : price;

  const handleAddToCart = async () => {
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
          navigate('/login');
        }
      });
      return;
    }

    setAdding(true);
    try {
      let userId = user.id;

      // If user.id is missing (e.g. Firebase user), fetch from backend using email
      if (!userId && user.email) {
        try {
          const userRes = await axiosInstance.get(`/api/users/email/${user.email}`);
          if (userRes.data.success) {
            userId = userRes.data.data.id || userRes.data.data.user_id;
          }
        } catch (err) {
          console.error("Error fetching user ID", err);
        }
      }

      if (!userId) {
        Swal.fire('Error', 'User identification failed. Please try logging in again.', 'error');
        setAdding(false);
        return;
      }

      const response = await axiosInstance.post('/api/cart/add', {
        product_id: product.id,
        user_id: userId,
        quantity: 1
      });

      if (response.data.success) {
        await Swal.fire({
          title: `${name} Added to Cart!`,
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire('Error', 'Failed to add item to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative">

      {/* Image Section */}
      <Link to={`/product/${product.id}`}>
        <div className="relative h-44 overflow-hidden bg-gray-50">
          <img
            src={image || "https://placehold.co/400x300?text=Product+Image"}
            alt={name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className='flex items-center justify-between'>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer" title={name}>
              {name}
            </h3>
          </Link>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className={`w-4 h-4 ${average_rating > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            <span className="text-xs text-gray-500 ml-1">({review_count || 0})</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-secondary">${discountedPrice}</span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through">${price}</span>
              )}
              <span className="text-xs text-gray-500">/{unit}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
