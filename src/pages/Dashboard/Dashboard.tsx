import Card from "@/components/Card/Card"
import Text from "@/components/Text/Text"

import c from "./Dashboard.module.scss"
import Heading from "@/components/Heading/Heading"
import Divider from "@/components/Divider/Divider"
import { ArrowRight, ArrowRightRounded, GitHub } from "@mui/icons-material"
import Discord from "@/assets/discord.svg" 
import Button from "@/components/Button/Button"
import { useNavigate } from "react-router-dom"
import api from "@/util/api"

const Dashboard = () => {
  const navigate = useNavigate()
  const { data: message, isError } = api.test.abc.useQuery()

  return (
    <div className={c.dashboard}>
      <div>Dashboard</div>
      <Card>
        <Heading>Active Apps</Heading>
        <Text size="x-large" weight="bold">123</Text>
        <Divider />
        <Text className={c.colored}>Go to Applications<ArrowRightRounded /></Text>
      </Card>
      { isError ? "Sadge" : message ?? "Loading..." }
    </div>
  )
}

export default Dashboard