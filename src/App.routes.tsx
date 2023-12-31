import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import SidebarPage from "@/components/Sidebar/SidebarPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import { ApplicationRoutes } from "./pages/Applications/Application.routes";


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
        children: ApplicationRoutes
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
    path: "login",
    Component: Login,
  },
  {
    path: "*",
    Component: NotFoundPage,
  }
]);