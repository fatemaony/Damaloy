import React from 'react';
import { motion } from 'framer-motion';
import { IoHomeOutline, IoPaperPlaneOutline } from "react-icons/io5";
import { MdPointOfSale } from "react-icons/md";
import { LuBaggageClaim } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import {
  FiList, FiShoppingBag,
  FiUsers,
} from 'react-icons/fi';
import { RiAdvertisementFill } from "react-icons/ri";
import { Link, NavLink, useLocation } from 'react-router';
import LogoImage from '../../assets/Logo.png';
import useAuth from '../../Hooks/useAuth';
import useUserRole from '../../Hooks/useUserRole';
import { FaCartPlus, FaShoppingCart } from 'react-icons/fa';


const DashboardLink = () => {
  const { user, SignOut } = useAuth();
  const { role } = useUserRole();
  const location = useLocation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  // Role-based navigation links
  const getNavLinks = () => {
    if (!user || !role) return [];


    const commonLinks = [];

    const userLinks = [
      { path: '/dashboard/user', name: 'Home', icon: <IoHomeOutline className='text-lg' /> },
      { path: '/dashboard/user/addToCart', name: 'My Cart', icon: <FiList className="text-lg" /> },
      { path: "/dashboard/user/myOrders", name: 'My Orders', icon: <FiShoppingBag className="text-lg" /> },
    ];

    const sellerLinks = [
      { path: '/dashboard/seller', name: 'Home', icon: <IoHomeOutline className='text-lg' /> },
      { path: '/dashboard/seller/addProducts', name: 'Add Products', icon: <FaCartPlus className="text-lg" /> },
      { path: "/dashboard/seller/myProducts", name: 'My Products', icon: <FaShoppingCart className="text-lg" /> },
      { path: "/dashboard/seller/postAdvertisement", name: 'Post Ad', icon: <RiAdvertisementFill className="text-lg" /> },
      { path: "/dashboard/seller/myAdvertisement", name: 'My Ads', icon: <RiAdvertisementFill className="text-lg" /> },
      { path: "/dashboard/seller/sells", name: 'Sales', icon: <MdPointOfSale /> },
    ];

    const adminLinks = [
      { path: '/dashboard/admin', name: 'Home', icon: <IoHomeOutline className='text-lg' /> },
      { path: '/dashboard/admin/allApplications', name: 'Applications', icon: <IoPaperPlaneOutline className="text-lg" /> },
      { path: '/dashboard/admin/allSellers', name: 'All Sellers', icon: <FiUsers className="text-lg" /> },
      { path: '/dashboard/admin/allProducts', name: 'All Products', icon: <LuBaggageClaim className="text-lg" /> },
      { path: '/dashboard/admin/allOrders', name: 'All Orders', icon: <AiOutlineProduct className="text-lg" /> },
      { path: '/dashboard/admin/allUsers', name: 'All Users', icon: <FiUsers className="text-lg" /> },

    ];

    const userRole = role.toLowerCase();

    if (userRole === 'admin') return [...adminLinks, ...commonLinks];
    if (userRole === 'seller') return [...sellerLinks, ...commonLinks];
    return [...userLinks, ...commonLinks];
  };

  const navLinks = getNavLinks();

  // Loading State
  if (!user || !role) {
    return (
      <div className="flex items-center justify-center h-full bg-base-200 text-base-content">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-full shadow-lg bg-base-300 text-base-content"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* --- Header / Logo Section --- */}
      <div className="p-6">
        <Link to={"/"} className="flex flex-col items-center justify-center gap-2">
          <img
            src={user?.photoURL || LogoImage}
            alt="Profile"
            className="w-15 h-15 rounded-full object-cover border-base-100"
          />
          <div className="text-center mt-2">
            <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded-full">
              {role} Dashboard
            </span>
          </div>
        </Link>
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex-1 lg:px-10 ">
        <motion.ul className="space-y-2" variants={containerVariants}>
          {navLinks.map((link) => (
            <motion.li key={link.path} variants={itemVariants}>
              <NavLink
                to={link.path}
                end={link.path.split('/').length <= 3}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group ${isActive
                    ? 'bg-primary text-primary-content shadow-md font-medium'
                    : 'hover:bg-base-100 hover:text-base-content'
                  }`
                }
              >
                <span className="mr-3 relative z-10">{link.icon}</span>
                <span className="relative z-10">{link.name}</span>

                {/* Active Indicator Dot */}
                {location.pathname === link.path && (
                  <motion.span
                    layoutId="navActive"
                    className="absolute right-3 w-2 h-2 bg-accent rounded-full z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </nav>



    </motion.div>
  );
};

export default DashboardLink;