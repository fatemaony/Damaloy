import React from 'react';
import { Link } from 'react-router';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from '../Logo/Logo';

const Footer = () => {
  return (
    <footer className="footer bg-base-300 lg:py-10 text-base-content">
      {/* Main content area */}
      <div className="container mx-auto p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          
          {/* Section 1: Brand */}
          <div className="flex-1 px-15 max-w-md">
            <div className='flex justify-items-start'>
              <Logo/>
            </div>
            <p className="mt-4 max-w-xs">
              Your port for fresh and delicious meals, delivered right to your doorstep.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-outline btn-primary">
                <FaFacebookF className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-outline btn-primary">
                <FaTwitter className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-outline btn-primary">
                <FaInstagram className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-outline btn-primary">
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div> 
          
          {/* Section 2: Quick Links */}
          <div className="flex-1 min-w-[150px]">
            <nav>
              <h6 className="footer-title text-base-content font-bold">Quick Links</h6> 
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="link link-hover hover:text-primary">Home</Link>
                </li>
                <li>
                  <Link to="/products" className="link link-hover hover:text-primary">Products</Link>
                </li>
                <li>
                  <Link to="/about" className="link link-hover hover:text-primary">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="link link-hover hover:text-primary">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>
            
          {/* Section 3: Legal */}
          <div className="flex-1 min-w-[150px]">
            <nav>
              <h6 className="footer-title text-base-content font-bold">Legal</h6> 
              <ul className="space-y-2">
                <li><a className="link link-hover hover:text-primary">Terms of use</a></li>
                <li><a className="link link-hover hover:text-primary">Privacy policy</a></li>
                <li><a className="link link-hover hover:text-primary">Cookie policy</a></li>
              </ul>
            </nav> 
          </div>
          
          {/* Section 4: Contact */}
          <div className="flex-1 min-w-[200px]">
            <nav>
              <h6 className="footer-title text-base-content font-bold">Contact Us</h6> 
              <ul className="space-y-2">
                <li><a className="link link-hover hover:text-primary">support@Damaloy.com</a></li>
                <li><a className="link link-hover hover:text-primary">+1 (234) 567-890</a></li>
                <li><p>123 Damaloy Street, Food City</p></li>
              </ul>
            </nav>
          </div>


          
        </div>
          {/* Bottom Copyright Bar */}
      <div className="text-center w-full border-base-300">
        <div className="text-center text-base-content">
            <p>Copyright © {new Date().getFullYear()} - All right reserved by Damaloy Industries Ltd.</p>
          </div>
      </div>
       
      </div>
      
     
    </footer>
  );
};

export default Footer;