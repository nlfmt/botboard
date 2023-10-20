import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import Home from "@/pages/Home/Home";
import SidebarPage from "@/components/Sidebar/SidebarPage";
import Dashboard from "@/pages/Dashboard/Dashboard";


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