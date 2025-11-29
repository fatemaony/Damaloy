import React from 'react';
import useUserRole from '../../Hooks/useUserRole';
import { Navigate } from 'react-router';

const DashboardRedirect = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (role === 'vendor') {
    return <Navigate to="/dashboard/seller" replace />;
  }

  return <Navigate to="/dashboard/user" replace />;
};

export default DashboardRedirect;
