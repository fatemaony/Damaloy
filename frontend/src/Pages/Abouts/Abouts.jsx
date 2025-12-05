import React from 'react';
import { FiAward, FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const Abouts = () => {
  return (
    <div className="bg-base-100 text-base-content font-sans">
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-primary mb-4 font-aladin tracking-wide">About Damaloy</h1>
            <p className="py-6 text-lg">
              Empowering communities through sustainable agriculture and fair trade. We bridge the gap between local farmers and conscious consumers.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 px-4 md:px-16 container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full -z-10"></div>
              <img
                src="https://www.mydccu.com/content/dccu/en/learn/resources/blog/grocery-shopping-tips/_jcr_content/root/teaser.coreimg.jpeg/1645562292080/grocery-tips.jpeg"
                alt="Farmers working in field"
                className="rounded-xl shadow-2xl w-full object-cover h-[400px]"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full -z-10"></div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-secondary">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At Damaloy, our mission is simple yet profound: to create a transparent, efficient, and equitable marketplace for agricultural products. We believe that hard-working farmers deserve fair prices for their produce, and consumers deserve fresh, high-quality goods at reasonable rates.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By leveraging technology, we eliminate unnecessary middlemen, ensuring that value is distributed fairly across the supply chain. We are committed to fostering a community where trust and sustainability grow together.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg min-w-[100px]">
                <span className="text-2xl font-bold text-primary">500+</span>
                <span className="text-sm">Farmers</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg min-w-[100px]">
                <span className="text-2xl font-bold text-primary">10k+</span>
                <span className="text-sm">Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-base-200 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Why Choose Damaloy?</h2>
            <p className="max-w-2xl mx-auto text-gray-600">We are dedicated to providing the best service and quality for our community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                  <FiAward size={32} />
                </div>
                <h3 className="card-title text-xl mb-2">Premium Quality</h3>
                <p className="text-gray-500">We ensure that every product listed on our platform meets strict quality standards.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                  <FiUsers size={32} />
                </div>
                <h3 className="card-title text-xl mb-2">Community First</h3>
                <p className="text-gray-500">We prioritize the well-being of our local farming communities and support local economies.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                  <FiTrendingUp size={32} />
                </div>
                <h3 className="card-title text-xl mb-2">Fair Pricing</h3>
                <p className="text-gray-500">Transparent pricing models that benefit both the producer and the consumer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Abouts;