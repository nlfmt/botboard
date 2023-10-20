import { nTimes } from "@/util/util"
import { AddRounded } from "@mui/icons-material"
import c from "./SidebarHeader.module.scss"

const SidebarHeader = () => {
  return (
    <header className={c.header}>
      <h1 className={c.logoWrapper}>
        <span className={c.leftPart}>bot</span>
        <span className={c.rightPart}>board</span>
      </h1>
      {nTimes(9, (n) => (
        <AddRounded className={c.decor} data-index={n} />
      ))}
    </header>
  )
}

export default SidebarHeader
