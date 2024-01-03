import { FC } from "react"
import c from "./AddApplication.module.scss"

export interface AddApplicationProps {
  onConfirm: () => void
}

const AddApplication: FC<AddApplicationProps> = (props) => {
  return (
    <button onClick={props.onConfirm}>AddApplication</button>
  )
}

export default AddApplication