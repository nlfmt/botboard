import { ReactNode, createContext, useContext } from "react";

export type ModalServiceType = {
  open: <T>(modal: React.FC<T>, data: T) => void;
};

export const ModalServiceContext = createContext({} as ModalServiceType);
export const useModalService = () => useContext(ModalServiceContext);

type ModalContextType = {
  close: () => void;
};

export const ModalContext = createContext({} as ModalContextType);
export const useModal = () => useContext(ModalContext);