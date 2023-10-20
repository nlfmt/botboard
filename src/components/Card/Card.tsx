import { FC } from "react"
import c from "./Card.module.scss"

export interface CardProps {
  children?: React.ReactNode
}

const Card: FC<CardProps> = (props) => {
  return (
    <div className={c.card}>
      {props.children}
    </div>
  )
}

export default Card