import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        modalRef.current,
        { scale: 0.7, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.7,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleConfirm = () => {
    gsap.to(modalRef.current, {
      scale: 0.7,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onConfirm
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleClose}>
            {cancelText}
          </button>
          <button className="btn-danger" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
