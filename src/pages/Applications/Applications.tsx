import Title from "@/components/Title/Title"
import c from "./Applications.module.scss"
import Divider from "@/components/Divider/Divider"
import Button from "@/components/Button/Button"
import { AddRounded, SearchRounded } from "@mui/icons-material"
import TextField from "@/components/TextField/TextField"

const Applications = () => {
  return (
    <div className={c.applications}>
      <Title>Applications</Title>
      <Divider />
      <div className={c.actionBar}>
        <div className={c.searchBar}>
          <TextField icon={<SearchRounded />} placeholder="Search" />
        </div>
        <div className={c.actionButtons}>
          <Button icon={<AddRounded />}>Create new</Button>
        </div>
      </div>
    </div>
  )
}

export default Applications