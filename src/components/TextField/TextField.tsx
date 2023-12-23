import { FC } from "react"
import c from "./TextField.module.scss"

export interface TextFieldProps {
  icon?: React.ReactNode
  placeholder?: string
}

const TextField: FC<TextFieldProps> = (props) => {
  return (
    <div className={c.textField}>
      {props.icon && props.icon}
      <input placeholder={props.placeholder} className={c.input}></input>
    </div>
  )
}

export default TextField