import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import SignUp from "../Components/Auth/SignUp";
import AuthLayout from "../Layouts/AuthLayout";
import SignIn from "../Components/Auth/SignIn";



export const router = createBrowserRouter([

  
  {
    path: "/",
    Component: MainLayout,
    children:[
      {
        index:true,
        Component:Home
      },
      
      
     
    ]
  },
  {
    path:"/",
    Component:AuthLayout,
    children:[
      {
          path:"signin",
          Component:SignIn
        },
        {
          path:"signUp",
          Component: SignUp
        }
    ]
  },
  
]);