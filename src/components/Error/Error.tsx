import { FC } from "react"
import c from "./Error.module.scss"
import { ErrorRounded } from "@mui/icons-material"
import Text, { TextProps } from "../Text/Text"
import { classes } from "@/util/util"

export interface ErrorProps {
  children: React.ReactNode
  size: TextProps["size"]
  className?: string
}

const Error: FC<ErrorProps> = (props) => {
  return (
    <Text className={classes(c.error, props.className)} size={props.size}>
      <ErrorRounded />
      {props.children}
    </Text>
  )
}

export default Error