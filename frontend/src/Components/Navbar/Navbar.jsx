import React from 'react'
import { Link } from 'react-router'
import { FaTachometerAlt, FaStore, FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2'
import useAuth from '../../Hooks/useAuth'
import useUserRole from '../../Hooks/useUserRole'
import useAxios from '../../Hooks/useAxios'
import Logo from '../Logo/Logo'

const Navbar = () => {
  const { user, loading, signOutUser } = useAuth();
  const { role } = useUserRole();
  const axiosInstance = useAxios();
  const [dbUser, setDbUser] = React.useState(null);

  const navItems = <>
    <Link to={"/"}><li className='text-secondary font-bold hover:underline px-5'>Home</li></Link>
    <Link to={"/products"}><li className='text-secondary font-bold hover:underline px-5'>Products</li></Link>
    {user && role === 'user' && (
      <>
        <Link to={"/my-cart"}><li className='text-secondary font-bold hover:underline px-5'>My Cart</li></Link>
        <Link to={"/my-orders"}><li className='text-secondary font-bold hover:underline px-5'>My Orders</li></Link>
      </>
    )}
    <Link to={"/about"}><li className='text-secondary font-bold hover:underline px-5'>About</li></Link>
    <Link to={"/contact"}><li className='text-secondary font-bold hover:underline px-5'>Contact</li></Link>
  </>

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const response = await axiosInstance.get(`/api/users/email/${user.email}`);

          if (response.data.success) {
            setDbUser(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user, axiosInstance]);

  const handleLogout = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#17671fff",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sign Out"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Sign Out!",
            text: "User signed out successfully.",
            icon: "success",
            buttonsStyling: false,
            customClass: { confirmButton: 'btn btn-primary' }
          });
          signOutUser();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const displayImage = dbUser?.photo_url || user?.photoURL;
  const displayName = dbUser?.name || user?.displayName;
  const displayEmail = dbUser?.email || user?.email;

  return (
    <div className="navbar lg:px-10 bg-base-100 shadow-md relative z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-64 p-2 shadow-lg">
            {navItems}
            <div className="lg:hidden flex flex-col gap-2 p-2 mt-2 border-t border-base-200">
              {user ? (
                <div className="w-full">
                  <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                    <input type="checkbox" />
                    <div className="collapse-title flex items-center gap-2 p-2 min-h-0">
                      <div className="w-8 h-8 border border-gray-200 rounded-full avatar">
                        <img alt="User profile" src={displayImage} className="rounded-full object-cover" />
                      </div>
                      <span className="font-bold text-sm truncate">{displayName}</span>
                    </div>
                    <div className="collapse-content p-0">
                      <ul className="menu menu-sm w-full bg-base-100 rounded-box">
                        <li className="menu-title px-4 py-1">
                          <div className="flex flex-col gap-0">
                            <span className="text-xs text-gray-500 font-normal lowercase truncate">{displayEmail}</span>
                          </div>
                        </li>
                        <div className="divider my-0"></div>
                        <li>
                          <Link to="/dashboard" className="flex items-center gap-3 py-2">
                            <FaTachometerAlt className="text-lg text-primary" />
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/become-seller" className="flex items-center gap-3 py-2">
                            <FaStore className="text-lg text-secondary" />
                            Become a Seller
                          </Link>
                        </li>
                        <div className="divider my-0"></div>
                        <li>
                          <button onClick={handleLogout} className="flex items-center gap-3 py-2 text-error hover:bg-error/10">
                            <FaSignOutAlt className="text-lg" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/signin" className="btn btn-outline btn-secondary w-full">Sign In</Link>
              )}
            </div>
          </ul>
        </div>
        <Logo />
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems}
        </ul>
      </div>

      <div className="navbar-end hidden lg:flex gap-2 items-center">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom" data-tip={displayName}>
              <div className="w-10 border-1 border-gray-200 rounded-full">
                <img alt="User profile" src={displayImage} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-base text-base-content">{displayName}</span>
                  <span className="text-xs text-gray-500 font-normal lowercase">{displayEmail}</span>
                </div>
              </li>
              <div className="divider my-0"></div>
              <li>
                <Link to="/dashboard" className="flex items-center gap-3 py-3">
                  <FaTachometerAlt className="text-lg text-primary" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="flex items-center gap-3 py-3">
                  <FaStore className="text-lg text-secondary" />
                  Become a Seller
                </Link>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-3 py-3 text-error hover:bg-error/10">
                  <FaSignOutAlt className="text-lg" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/signin" className="btn btn-outline btn-secondary">Sign In</Link>
        )}
      </div>
    </div>
  )
}

export default Navbar;