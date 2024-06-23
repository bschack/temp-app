import { useState } from "react";

import styles from './index.module.css';
import clsx from "clsx";
import { Close } from "@/lib/icons/close/Close";

type ModalProps = {
  children: React.ReactNode;
  header: string;
};

export const Modal = ({ children, header, close }: ModalProps & { close: () => void }) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      close();
    }, 300); 
  };

  return (
    <div className={clsx(styles.modal_overlay, isClosing && styles.closing)} onClick={handleClose}>
      <div className={styles.modal} onClick={e => {e.stopPropagation()}}>
        <div className={styles.modal_header}>
          <h2>{header}</h2>
          <div onClick={handleClose}><Close /></div>
        </div>
        <div className={styles.model_content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export const useModal = ({ children, header }: ModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
    Modal: isOpen ? <Modal header={header} close={closeModal}>{children}</Modal> : <></>,
  };
}