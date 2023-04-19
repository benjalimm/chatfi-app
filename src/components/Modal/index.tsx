// components/Modal.tsx
import React from 'react';
import styles from './index.module.css';

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, children }) => {
  return (
    <div className={`${styles.modal} ${show ? styles.show : ''}`}>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Modal;
