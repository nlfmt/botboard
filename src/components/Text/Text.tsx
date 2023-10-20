import { FC } from "react"
import c from "./Text.module.scss"
import { classes } from "@/util/util"

export interface TextProps {
  children?: React.ReactNode
  className?: string
  size?: "small" | "medium" | "large" | "x-large"
  weight?: "light" | "regular" | "bold"
}

const Text: FC<TextProps> = (props) => {
  return (
    <span className={classes(c.text, props.className)} data-size={props.size} data-weight={props.weight}>
      {props.children}
    </span>
  )
}

export default Text