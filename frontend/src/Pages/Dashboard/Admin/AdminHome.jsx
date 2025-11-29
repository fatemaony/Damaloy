import React from 'react'

const AdminHome = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>
        <div className="stat">
          <div className="stat-title">Revenue</div>
          <div className="stat-value">$0</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
