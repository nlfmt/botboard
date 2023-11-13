import { classes } from "@/util/util"
import c from "./Title.module.scss"

export interface TitleProps {
  children: React.ReactNode
  className?: string
  align?: "left" | "center" | "right"
}

const Title = (props: TitleProps) => {
  return (
    <h2
      className={classes(
        c.title,
        props.className
      )}
      style={{ textAlign: props.align }}
    >
      {props.children}
    </h2>
  )
}

export default Title
