interface ModalProps {
  modalHeader: any
  modalContent: any
  modalExtras: any
}

const Modal = ({ modalHeader, modalContent, modalExtras }: ModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">{modalHeader}</div>
        <div className="modal-content">{modalContent}</div>
        {modalExtras}
      </div>
    </div>
  )
}

export default Modal
