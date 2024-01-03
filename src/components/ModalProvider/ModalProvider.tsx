import { FC, ReactNode, useState } from "react"
import c from "./ModalProvider.module.scss"
import { ModalContext, ModalServiceContext, ModalServiceType, useModal } from "@/contexts/modal.context"
import { createPortal } from "react-dom"

export interface ModalProviderProps {
  children: ReactNode
}


const modalRoot = document.getElementById("modal-root")

const Overlay = (props: { children: ReactNode }) => {
  const modal = useModal()

  return (
    <div className={c.overlay} onClick={modal.close}>
      <div className={c.modalContainer} onClick={e => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  )
}

type ModalInfo = { component: React.FC, data: unknown }

const ModalProvider: FC<ModalProviderProps> = (props) => {

  const [modal, setModal] = useState<ModalInfo | null>(null)

  const open = (modal: React.FC, data: unknown) => setModal({ component: modal, data })
  const close = () => setModal(null)

  return (
    <>
      <ModalServiceContext.Provider value={{ open: open as ModalServiceType["open"] }}>
        {props.children}
      </ModalServiceContext.Provider>
      
      <ModalContext.Provider value={{ close }}>
        {modalRoot && modal && createPortal(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Overlay><modal.component {...(modal.data as any)} /></Overlay>,
          modalRoot
        )}
      </ModalContext.Provider>
    </>
  )
}

export default ModalProvider