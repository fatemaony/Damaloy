import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import SignUp from "../Components/Auth/SignUp";
import AuthLayout from "../Layouts/AuthLayout";
import SignIn from "../Components/Auth/SignIn";
import SellerApplication from "../Pages/SellerApplication/SellerApplication";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardRedirect from "../Components/Dashboard/DashboardRedirect";
import AdminHome from "../Components/Dashboard/Admin/AdminHome";
import SellerHome from "../Components/Dashboard/Seller/SellerHome";
import UserHome from "../Components/Dashboard/User/UserHome";
import AllProducts from "../Components/Dashboard/Admin/AllProducts";
import AllSellers from "../Components/Dashboard/Admin/AllSellers";
import AllOrders from "../Components/Dashboard/Admin/AllOrders";
import AllUsers from "../Components/Dashboard/Admin/AllUsers";
import AddProduct from "../Components/Dashboard/Seller/AddProduct";
import MyProducts from "../Components/Dashboard/Seller/MyProducts";
import AddAdvertisement from "../Components/Dashboard/Seller/AddAdvertisement";
import MyAdvertisement from "../Components/Dashboard/Seller/MyAdvertisement";
import Sells from "../Components/Dashboard/Seller/Sells";
import MyCart from "../Components/Dashboard/User/MyCart";
import MyOrders from "../Components/Dashboard/User/MyOrders";
import Allapplication from "../Components/Dashboard/Admin/Allapplication";
import Products from "../Pages/Products/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "become-seller",
        Component: SellerApplication
      },
      {
        path: "products",
        Component: Products
      }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "signin",
        Component: SignIn
      },
      {
        path: "signUp",
        Component: SignUp
      }
    ]
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        path: "admin",
        Component: AdminHome
      },
      {
        path: "admin/allProducts",
        Component: AllProducts
      },
      {
        path: "admin/allApplications",
        Component: Allapplication
      },
      {
        path: "admin/allSellers",
        Component: AllSellers
      },
      {
        path: "admin/allOrders",
        Component: AllOrders
      },
      {
        path: "admin/allUsers",
        Component: AllUsers
      },
      {
        path: "seller",
        Component: SellerHome
      },
      {
        path: "seller/addProducts",
        Component: AddProduct
      },
      {
        path: "seller/myProducts",
        Component: MyProducts
      },
      {
        path: "seller/postAdvertisement",
        Component: AddAdvertisement
      },
      {
        path: "seller/myAdvertisement",
        Component: MyAdvertisement
      },
      {
        path: "seller/sells",
        Component: Sells
      },
      {
        path: "user",
        Component: UserHome
      },
      {
        path: "user/myCart",
        Component: MyCart
      },
      {
        path: "user/addToCart",
        Component: MyCart
      },
      {
        path: "user/myOrders",
        Component: MyOrders
      }
    ]
  }
]);