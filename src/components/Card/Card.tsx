import { FC } from "react"
import c from "./Card.module.scss"
import { classes } from "@/util/util"

export interface CardProps {
  children?: React.ReactNode
  className?: string
}

const Card: FC<CardProps> = (props) => {
  return (
    <div className={classes(c.card, props.className)}>
      {props.children}
    </div>
  )
}

export default Card