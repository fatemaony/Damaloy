import React, { useEffect, useState } from 'react';
import useAxios from '../../Hooks/useAxios';
import ProductCard from '../Products/ProductCard';
import { Loader2 } from 'lucide-react';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axiosInstance.get('/api/products?has_discount=true&limit=8');
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no offers
  }

  return (
    <div className="py-16 lg:px-15 px-5 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-primary mb-4">
            Special Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Grab these amazing deals before they're gone! Limited time discounts on selected items.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;