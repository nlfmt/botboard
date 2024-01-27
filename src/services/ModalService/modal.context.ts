import { createContext, useContext } from "react";

export type ModalService = {
  open: <T>(modal: React.FC<T>, data: T) => void;
};

const ModalServiceContext = createContext({} as ModalService);
export const useModalService = () => {
  const ctx = useContext(ModalServiceContext);
  if (!ctx) throw new Error("ModalServiceContext was not provided. Did you forget to wrap your app in a ModalServiceProvider?");
  return ctx;
}
export const ModalServiceProvider = ModalServiceContext.Provider;

export type Modal = {
  close: () => void;
};

export const ModalContext = createContext<Modal | null>(null);
export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error("ModalContext was not provided. Was the modal opened with the ModalService?")
  return ctx
}