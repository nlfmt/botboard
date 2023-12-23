import { RouteObject } from "react-router-dom";
import Applications from "./Applications";
import CreateApplication from "./CreateApplication";

export const ApplicationRoutes: RouteObject[] = [
  {
    path: "",
    Component: Applications
  },
  {
    path: "create",
    Component: CreateApplication
  }
]