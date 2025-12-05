import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

// Import images
import FruitsImg from '../../assets/Banners/Fruits.png';
import GroceriesImg from '../../assets/Banners/Groceries.png';
import VegetablesImg from '../../assets/Banners/Vegetables.png';

const banners = [
  {
    id: 1,
    image: VegetablesImg,
    subtitle: "100% Healthy & Affordable",
    title: "Organic Vegetables",
    description: "Experience the freshness of naturally grown vegetables that bring nutrition straight to your plate. Our organic picks are free from harmful chemicals, ensuring a healthier lifestyle.",
    buttonText: "Shop Now",
    link: "/products?category=vegetables",
    bgColor: "#eefce3"
  },
  {
    id: 2,
    image: GroceriesImg,
    subtitle: "Natural Health Care Ingredients",
    title: "Grocery Shopping",
    description: "Find all your essential household groceries in one convenient place. From daily cooking staples to premium quality ingredients, we’ve got everything to support your healthy lifestyle.",
    buttonText: "Shop Now",
    link: "/products?category=groceries",
    bgColor: "#f4ede7"
  },
  {
    id: 3,
    image: FruitsImg,
    subtitle: "Fresh & Sweet",
    title: "Fresh Fruits",
    description: "Refresh your day with our handpicked, sweet, and juicy fruits sourced for maximum freshness. Packed with vitamins and natural goodness, they are perfect for maintaining a balanced diet.",
    buttonText: "Shop Now",
    link: "/products?category=fruits",
    bgColor: "#eefce3"
  }
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] md:h-[550px] overflow-hidden group">
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full flex items-center"
          style={{ backgroundColor: banners[current].bgColor }}
        >
          <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between h-full gap-8 py-10 md:py-0">

            {/* Content Side (Left) */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full md:w-1/2 text-center md:text-left z-10 flex flex-col items-center md:items-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-bold tracking-wider text-xs md:text-sm uppercase bg-white/50 px-3 py-1 rounded-full">
                  {banners[current].subtitle}
                </span>
              </div>

              <h2 className="text-3xl md:text-6xl font-bold text-gray-800 mb-4 font-aladin leading-tight">
                {banners[current].title}
              </h2>

              <p className="text-gray-600 text-sm md:text-lg mb-6 md:mb-8 max-w-md">
                {banners[current].description}
              </p>

              <Link
                to={banners[current].link}
                className="btn btn-primary rounded-full px-8 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/30"
              >
                {banners[current].buttonText}
              </Link>
            </motion.div>

            {/* Image Side (Right) */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full md:w-1/2 h-[40%] md:h-full flex items-center justify-center relative"
            >
              <img
                src={banners[current].image}
                alt={banners[current].title}
                className="w-auto h-full max-h-[250px] md:max-h-[450px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${current === index ? "bg-primary w-6 md:w-8" : "bg-gray-400/50 hover:bg-white"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;