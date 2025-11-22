import React from 'react';
import { motion } from 'framer-motion';
import { IoHomeOutline } from "react-icons/io5";
import { 
  FiTrendingUp, FiList, FiShoppingBag, FiPlusSquare, 
  FiPackage, FiSpeaker, FiUsers,  
  FiShoppingCart, FiUser, FiLogOut, 

} from 'react-icons/fi';
import { Link, NavLink, useLocation } from 'react-router';
import useAuth from '../../Hooks/useAuth';



const DashboardLink = () => {
  const { user, SignOut } = useAuth(); 
  const location = useLocation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleSignOut = () => {
    SignOut()
      .then(() => console.log("Sign out successfully"))
      .catch(error => console.log(error));
  };
  // Role-based navigation links
  const getNavLinks = () => {
    if (!user || !role || !seller) return [];

    const commonLinks = [
      
    ];

    const userLinks = [
      { path: '/dashboard/user', name: 'Home', icon: <IoHomeOutline className='text-lg' />},
      { path: '/dashboard/user/addToCart', name: 'My Cart', icon: <FiList className="text-lg" /> },
      { path: "/dashboard/user/myOrders", name: 'My Orders', icon: <FiShoppingBag className="text-lg" /> },
      
    ];
    const sellerLinks = [
      { path: '/dashboard/seller', name: 'Home', icon: <IoHomeOutline className='text-lg' />},
      { path: '/dashboard/seller/addProducts', name: 'Add new Product', icon: <FiList className="text-lg" /> },
      { path: "/dashboard/seller/myProducts", name: 'My All Products', icon: <FiShoppingBag className="text-lg" /> },
      { path: "/dashboard/seller/postAdvertisement", name: 'Add Advertisement', icon: <FiShoppingBag className="text-lg" /> },
      { path: "/dashboard/seller/myAdvertisement", name: 'All Advertisement', icon: <FiShoppingBag className="text-lg" /> },
       { path: "/dashboard/seller/sells", name: 'Sells Products', icon: <FiShoppingBag className="text-lg" /> }
      
    ];

    const adminLinks = [
      { path: '/dashboard/admin', name: 'Home', icon: <IoHomeOutline className='text-lg' />},
      { path: '/dashboard/admin/allProducts', name: 'All Products', icon: <FiPackage className="text-lg" /> },
      { path: '/dashboard/admin/allsellers', name: 'All Sellers', icon: <FiPackage className="text-lg" /> },
      { path: '/dashboard/Admin/allOrders', name: 'All Orders', icon: <FiShoppingCart className="text-lg" /> },
      { path: '/dashboard/admin/allUsers', name: 'All Users', icon: <FiUsers className="text-lg" /> },
    ];

    let roleLinks = [];
    if (role && role.toLowerCase() === 'admin') {
      roleLinks = [...adminLinks];
    } else {
      roleLinks = [...userLinks];
    }

    return [...roleLinks, ...commonLinks];
  };

  const navLinks = getNavLinks();

  if (!user || !role) {
    return <div className="flex flex-col h-full bg-base-200 text-base-content p-4">Loading...</div>;
  }

  return (
    <motion.div 
      className="flex flex-col shadow-lg p-5 h-full bg-base-300 text-base-content"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <Link to={"/"}>
      <div className='flex items-center justify-center mx-10'>
      <img className='w-20 h-20' src={logoPicture} alt="logo" /> 
       
      <div className="text-primary ">
        <h1 className="text-3xl font-bold">
          {role && role.toLowerCase() === 'admin' ? 'Admin' : 
           role && role.toLowerCase() === 'vendor' ? 'Vendor Dashboard' : 'Dashboard'}
        </h1>
      </div>
      </div>
      </Link>

      <nav className="flex-1 p-4 overflow-y-auto">
        <motion.ul className="space-y-2" variants={containerVariants}>
          {navLinks.map((link) => (
            <motion.li key={link.path} variants={itemVariants}>
              <NavLink
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-all relative ${isActive ? 
                    'bg-primary text-primary-content shadow-md' : 
                    'hover:bg-base-300 hover:text-base-content'}`
                }
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
                {location.pathname === link.path && (
                  <motion.span 
                    layoutId="navActive"
                    className="absolute right-4 w-2 h-2 bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      <div className="p-4 border-t border-base-300">
        <motion.button
          onClick={()=>handleSignOut()}
          className="flex items-center w-full p-3 rounded-lg bg-error text-error-content transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiLogOut className="mr-3 text-lg" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashboardLink;