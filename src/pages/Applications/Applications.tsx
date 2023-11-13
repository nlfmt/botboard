import Title from "@/components/Title/Title"
import c from "./Applications.module.scss"
import Divider from "@/components/Divider/Divider"
import Button from "@/components/Button/Button"

const Applications = () => {
  return (
    <div className={c.applications}>
      <Title>Applications</Title>
      <Divider />
      <div className={c.actionBar}>
        <div className={c.searchBar}>
          <input type="text" placeholder="Search" />
        </div>
        <div className={c.actionButtons}>
          <Button>Add</Button>
        </div>
      </div>
    </div>
  )
}

export default Applications