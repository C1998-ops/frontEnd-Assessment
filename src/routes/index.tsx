import React from "react";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import { Logout } from "../pages/Logout";

interface PublicRoute {
  path: string;
  element: React.ReactElement;
  page?: string | undefined;
  children?: PublicRoute[];
}
interface ProtectedRoutes {
  path?: string;
  index?: boolean;
  element: React.ReactElement;
  children?: ProtectedRoutes[];
}

export const publicRoutes: PublicRoute[] = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
];

export const protectedRoutes: ProtectedRoutes[] = [
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
];
