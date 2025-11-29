import React from 'react'
import useAuth from '../../../Hooks/useAuth'

const UserHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.displayName}!</h2>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">My Activity</h2>
          <p>Check your recent orders and wishlist items.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View Orders</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHome
