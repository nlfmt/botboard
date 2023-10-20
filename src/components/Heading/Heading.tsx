import { classes } from "@/util/util"
import c from "./Heading.module.scss"

export interface HeadingProps {
  children: string
  className?: string
}

const Heading = (props: HeadingProps) => {
  return (
    <h2 className={classes(c.heading, props.className)}>{props.children}</h2>
  )
}

export default Heading
