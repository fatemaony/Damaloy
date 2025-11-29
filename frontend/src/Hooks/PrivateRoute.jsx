import React, { use } from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "./useAuth";




const PrivateRouter =({children})=>{
  const {user, loading}= useAuth()
  const location = useLocation();
  if (loading) {
    return <span className="loading loading-ring loading-xl text-center"></span>  
  }

  if (!user) {
    return <Navigate to={"/auth/login"} state={location.pathname}></Navigate>
    
  }
  return children;
};
export default PrivateRouter;