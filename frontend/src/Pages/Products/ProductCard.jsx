import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { name, image, price, rating, unit, store_category } = product || {};

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative">

      {/* Image Section */}
      <div className="relative h-44 overflow-hidden bg-gray-50">
        <img
          src={image || "https://placehold.co/400x300?text=Product+Image"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className='flex items-center justify-between'>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer" title={name}>
            {name}
          </h3>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className='w-4 h-4 text-yellow-400' />
            <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-secondary">${price}</span>
              <span className="text-xs text-gray-500">/{unit}</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 active:scale-95">
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
