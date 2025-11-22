import React from 'react'
import { Link } from 'react-router'
import Logo from '../Logo/Logo'
import useAuth from '../../Hooks/useAuth'

const Navbar = () => {
  const { user, signOutUser } = useAuth() 

  const navItems = <> 
    <Link to={"/"}><li className='text-secondary font-bold hover:underline  px-5'>Home</li></Link>
    <Link to={"/products"}><li className='text-secondary font-bold hover:underline  px-5'>Products</li></Link>
    <Link to={"/offer"}><li className='text-secondary font-bold hover:underline  px-5'>Offers</li></Link>
    <Link to={"/about"}><li className='text-secondary font-bold hover:underline  px-5'>About</li></Link>
    <Link to={"/contact"}><li className='text-secondary font-bold hover:underline px-5'>Contact</li></Link>
  </>

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log('User signed out successfully')
      })
      .catch((error) => {
        console.error('Sign out error:', error)
      })
  }

  return (
    <div className="navbar bg-base-200 px-10 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {navItems}
            
            {/* Mobile view user profile */}
            {user && (
              <div className="px-4 py-2 border-t mt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img 
                        src={user?.photoURL || user?.image || '/default-avatar.png'} 
                        alt={user?.displayName || user?.name || 'User'} 
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {user?.displayName || user?.name || 'User'}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="btn btn-sm btn-outline btn-error w-full"
                >
                  Sign Out
                </button>
              </div>
            )}
          </ul>
        </div>
        
        <Logo/>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems}
        </ul>
      </div>
      
      <div className='navbar-end'>
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img 
                  src={user?.photoURL || user?.image || '/default-avatar.png'} 
                  alt={user?.displayName || user?.name || 'User'} 
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li className="px-4 py-2 border-b">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {user?.displayName || user?.name || 'User'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {user?.email}
                  </span>
                </div>
              </li>
              
              <li>
                <button onClick={handleSignOut} className="text-error font-medium">
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to={"/signin"}>
            <button className='btn btn-primary'>Sign In</button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar