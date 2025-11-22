import React from 'react';
import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import AuthLottie from '../Assets/lottie/signUp.json';
import Logo from '../Components/Logo/Logo';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-300 ">
      <div className='flex justify-items-start px-10 pt-5'>
        <Logo/>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Lottie animation section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-md lg:max-w-xl"
          >
            <div className="p-8">
              <Lottie 
                animationData={AuthLottie} 
                loop={true} 
                className="w-full h-auto"
              />
            </div>
           
          </motion.div>

          {/* Outlet (sign-in/sign-up forms) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-md w-full mt-10"
          >
            <div className="">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  )
}

export default AuthLayout;