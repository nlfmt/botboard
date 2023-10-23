import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import SidebarPage from "@/components/Sidebar/SidebarPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: SidebarPage,
    children: [
      {
        path: "",
        Component: Dashboard,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "logs",
        Component: Dashboard,
      },
      {
        path: "commands",
        Component: Dashboard,
      },
      {
        path: "control",
        Component: Dashboard,
      },
      {
        path: "applications",
        Component: Dashboard,
      },
      {
        path: "docs",
        Component: Dashboard,
      },
      {
        path: "settings",
        Component: Dashboard,
      },
      {
        path: "account",
        Component: Dashboard,
      },
    ]
  },
  {
    path: "*",
    Component: NotFoundPage,
  }
]);