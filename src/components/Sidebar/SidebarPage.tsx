import Sidebar from "@/components/Sidebar/Sidebar"
import { Outlet } from "react-router-dom"

import c from "./SidebarPage.module.scss"

const SidebarPage = () => {
  return (
    <div className={c.page}>
      <Sidebar />
      <div className={c.content}>
        <Outlet />
      </div>
    </div>
  )
}

export default SidebarPage