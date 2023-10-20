import { useNavigate } from "react-router-dom"
import c from "./SidebarLink.module.scss"

export interface SidebarLinkProps {
  icon: JSX.Element
  name: string
  url: string
  type?: "primary" | "secondary" | "danger"
  active?: boolean
}

const SidebarLink = (props: SidebarLinkProps) => {
  const navigate = useNavigate()
  const urlPath = window.location.pathname

  return (
    <div
      className={c.link}
      data-active={props.active ?? urlPath === props.url}
      data-type={props.type ?? "primary"}
      onClick={() => navigate(props.url)}
    >
      {props.icon}
      {props.name}
    </div>
  )
}

export default SidebarLink
