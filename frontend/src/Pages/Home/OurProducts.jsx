import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAxios from '../../Hooks/useAxios';
import ProductCard from '../Products/ProductCard';
import {
  GiFruitBowl,
  GiMeat,
  GiCarrot,
  GiTomato,
  GiMilkCarton,
} from 'react-icons/gi';
import { Loader2 } from 'lucide-react';
import { IoStorefront } from 'react-icons/io5';

const categories = [
 
  { name: "Fruits", icon: <GiFruitBowl className="text-4xl" />, color: "bg-red-50 text-red-600", link: "Fruits" },
  { name: "Meat", icon: <GiMeat className="text-4xl" />, color: "bg-yellow-50 text-yellow-600", link: "Meat" },
  { name: "Vegetables", icon: <GiTomato className="text-4xl" />, color: "bg-green-50 text-green-600", link: "Vegetable" },
  { name: "Grocery", icon: <GiMilkCarton className="text-4xl" />, color: "bg-blue-50 text-blue-600", link: "Grocery" },
  { name: "Supermarket", icon: <IoStorefront className="text-4xl" />, color: "bg-yellow-50 text-yellow-600", link: "Supermarket" },
  
];

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products/top');
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [axiosInstance]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="container mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary font-aladin mb-4">
            Our Products
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Mauris vitae ultricies leo integer malesuada nunc vel in arcu cursus
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.link)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${cat.color} transition-transform transform group-hover:scale-110 shadow-sm relative overflow-hidden`}>
                {/* Blob shape effect using border-radius manipulation or just simple circle for now */}
                <div className="absolute inset-0 opacity-20 bg-current rounded-full animate-pulse"></div>
                <span className="relative z-10">{cat.icon}</span>
              </div>
              <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No top products found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurProducts;