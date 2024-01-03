import Title from "@/components/Title/Title"
import c from "./Applications.module.scss"
import Divider from "@/components/Divider/Divider"
import Button from "@/components/Button/Button"
import { AddRounded, SearchRounded } from "@mui/icons-material"
import TextField from "@/components/TextField/TextField"
import api from "@/util/api"
import ApplicationCard from "./ApplicationCard"
import { useModalService } from "@/contexts/modal.context"
import AddApplication from "@/components/modals/AddApplication/AddApplication"

const Applications = () => {

  const { data: apps } = api.application.all.useQuery()
  const { mutateAsync: createApp } = api.application.create.useMutation()
  const utils = api.useUtils()
  const modalService = useModalService()

  return (
    <div className={c.applications}>
      <Title className={c.title}>Applications</Title>
      <div className={c.actionBar}>
        <div className={c.searchBar}>
          <TextField icon={<SearchRounded />} placeholder="Search" />
        </div>
        <div className={c.actionButtons}>
          <Button icon={<AddRounded />} onClick={() => {
            modalService.open(AddApplication, { onConfirm: async () => {
              const app = await createApp({
                name: "New application",
              })
              utils.application.all.setData(undefined, apps => (apps ? [...apps, app] : [app]))
            } })
          }}>Create new</Button>
        </div>
      </div>
      <Divider />
      <div className={c.applicationsList}>
        {!apps ? "Loading..." : (
          apps.length === 0 ? (
            "No applications. Create one!"
          ) : (
            apps.map(app => (
              <ApplicationCard key={app.id} app={app} />
            ))
          )
        )}
      </div>
    </div>
  )
}

export default Applications