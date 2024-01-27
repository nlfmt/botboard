import { FC } from "react"
import c from "./AddApplication.module.scss"
import { useModal } from "@/services/ModalService/modal.context"

export interface AddApplicationProps {
  onConfirm: () => void
}

const AddApplication: FC<AddApplicationProps> = (props) => {
  const modal = useModal()
  return (
    <button onClick={() => {
      props.onConfirm()
      modal.close()
    }}>AddApplication</button>
  )
}

export default AddApplication