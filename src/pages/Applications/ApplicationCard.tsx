import { FC } from "react"
import c from "./ApplicationCard.module.scss"

import Text from "@/components/Text/Text"
import Card from "@/components/Card/Card"
import Divider from "@/components/Divider/Divider"

export interface ApplicationCardProps {
  app: {
    id: string
    name: string
  }
}

const ApplicationCard: FC<ApplicationCardProps> = (props) => {
  return (
    <Card className={c.card}>
      <Text weight="bold" size="large" className={c.title}>{props.app.name}</Text>
      <Divider />
      <div className={c.stats}>
        <Text className={c.stat}>
          <Text weight="bold">0</Text> Users
        </Text>
        <Text className={c.stat}>
          <Text weight="bold">0</Text> Roles
        </Text>
      </div>
    </Card>
  )
}

export default ApplicationCard