import React from "react";

// Admin Imports
import MainDashboard from "./views/admin/default";

// Icon Imports
import {
  MdStorefront,
  MdBarChart,
  MdPerson,
  MdLock,
  MdMenuBook,
  MdMoney,
  MdGamepad,
  MdDeliveryDining,
  MdComputer,
  MdOutlineAutorenew
} from "react-icons/md";

import Company from "components/icons/Company";
import SignIn from "./views/auth/signIn";
import Profile from "./views/admin/profile";
import Menu from "./views/admin/menu";
import Menus from "./views/admin/menus";
import Products from "./views/admin/products";
import ArchiveBox from "./components/icons/ArchiveBox";
import Branch from "./views/admin/branch";
import NewCompany from "views/auth/NewCompany";
import Payment from "./views/admin/payment";
import Games from "./views/admin/games";
import Tables from "./views/admin/tables";
import Order from "./views/admin/order";
import SelectBranch from "./views/auth/selectBranch/SelectBranch";
import SignUp from "./views/auth/SignUp";
import ForgotPassword from "./views/auth/ForgotPassword";
import ManageStaff from "./views/admin/ManageStaff";
import OrderTable from "./views/admin/orderTable";
import Dashboard from "./views/admin/reports/additionReport";
import OrderTracking from "./views/admin/orderTracking";

const routes = [
 /* {
    name: "Paneller",
    layout: "/admin",
    path: "default",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <MainDashboard />,
    allowedRoles : ["ADMIN"],
    isShow: true
  },*/
  {
    name: "Şube",
    layout: "/admin",
    path: "branches/:id",
    icon: <MdStorefront className="h-6 w-6" />,
    component: <Branch />,
    allowedRoles : ["ADMIN"],
    isShow: false,
    secondary: true,
  },
  {
    name: "Çalışanlar",
    layout: "/admin",
    path: "staffs/:id",
    icon: <MdStorefront className="h-6 w-6" />,
    component: <ManageStaff />,
    allowedRoles : ["ADMIN"],
    isShow: false,
    secondary: true,
  },
  {
    name: "menuler",
    layout: "/admin",
    path: "menus",
    icon: <MdMenuBook className="h-6 w-6" />,
    component: <Menus />,
    allowedRoles : ["ADMIN"],
    isShow: true,
    secondary: true,
  },
  {
    name: "menu",
    layout: "/admin",
    path: "menus/:id",
    icon: <MdMenuBook className="h-6 w-6" />,
    component: <Menu />,
    allowedRoles : ["ADMIN"],
    isShow: false,
    secondary: true,
  },
  {
    name: "Ürünler",
    layout: "/admin",
    path: "products",
    icon: <ArchiveBox className="h-6 w-6" />,
    component: <Products />,
    allowedRoles : ["ADMIN"],
    isShow: true,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "forgot password",
    layout: "/auth",
    path: "forgot-password/:id",
    icon: <MdLock className="h-6 w-6" />,
    component: <ForgotPassword />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "Create Company",
    layout: "/auth",
    path: "new-company",
    icon: <Company className="h-6 w-6" />,
    component: <NewCompany />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "Payment page",
    layout: "/admin",
    path: "payment",
    icon: <MdMoney className="h-6 w-6" />,
    component: <Payment />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "Oyunlar",
    layout: "/admin",
    path: "games",
    icon: <MdGamepad className="h-6 w-6" />,
    component: <Games />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },
  {
    name: "Masalar",
    layout: "/admin",
    path: "tables",
    icon: <MdComputer className="h-6 w-6" />,
    component: <Tables />,
    allowedRoles : ["ADMIN"],
    isShow: true
  },
  {
    name: "Masa siparis",
    layout: "/admin",
    path: "order/:id",
    icon: <MdDeliveryDining className="h-6 w-6" />,
    component: <OrderTable />,
    allowedRoles : ["ADMIN","STAFF"],
    isShow: false
  },
  {
    name: "Masa siparisleri",
    layout: "/admin",
    path: "order",
    icon: <MdDeliveryDining className="h-6 w-6" />,
    component: <Order />,
    allowedRoles : ["ADMIN","STAFF"],
    isShow: true
  },
  {
    name: "Beklenen Siparişler",
    layout: "/admin",
    path: "order-tracking",
    icon: <MdOutlineAutorenew className="h-6 w-6" />,
    component: <OrderTracking />,
    allowedRoles : ["ADMIN","STAFF"],
    isShow: true
  },
  {
    name: "sube sec",
    layout: "/auth",
    path: "select-branch",
    icon: <MdDeliveryDining className="h-6 w-6" />,
    component: <SelectBranch />,
    allowedRoles : ["ADMIN"],
    isShow: false
  },

  {
    name: "Raporlar",
    layout: "/admin",
    path: "report",
    icon: <MdMoney className="h-6 w-6" />,
    component: <Dashboard />,
    allowedRoles : ["ADMIN"],
    isShow: true
  },

];
export default routes;
