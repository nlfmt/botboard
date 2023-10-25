import {
  GridViewRounded,
  LineAxisRounded,
  LogoutRounded,
  NotesRounded,
  PodcastsRounded,
  SettingsRounded,
} from "@mui/icons-material"
import c from "./Sidebar.module.scss"
import SidebarLink from "@/components/Sidebar/SidebarLink/SidebarLink"
import SidebarHeader from "@/components/Sidebar/SidebarHeader/SidebarHeader"
import Heading from "@/components/Heading/Heading"
import AccountInfo from "@/components/Sidebar/AccountInfo/AccountInfo"
import useUser from "@/hooks/useUser"
import { signOut } from "@/util/auth"

const Sidebar = () => {
  const { user } = useUser()

  return (
    <div className={c.sidebar}>
      <SidebarHeader />

      <section className={c.statistics}>
        <Heading>Statistics</Heading>
        <SidebarLink url="/" name="Dashboard" icon={<LineAxisRounded />} />
        <SidebarLink url="/logs" name="Logs" icon={<NotesRounded />} />
        <SidebarLink url="/control" name="Control" icon={<PodcastsRounded />} />
      </section>

      <section className={c.management}>
        <Heading>Management</Heading>
        <SidebarLink
          url="/applications"
          name="My Applications"
          icon={<GridViewRounded />}
        />
        <SidebarLink
          url="/settings"
          name="Settings"
          icon={<SettingsRounded />}
        />
      </section>

      <section className={c.account}>
        <Heading>Account</Heading>
        {user && (
          <>
            <AccountInfo user={user} />
            <SidebarLink name="Logout" type="danger" onClick={signOut} icon={<LogoutRounded />} />
          </>
        )}
      </section>
      <footer>
        <p>
          © 2023 Tom F, all rights reserved
          <br />
          Made with &lt;3
        </p>
      </footer>
    </div>
  )
}

export default Sidebar
