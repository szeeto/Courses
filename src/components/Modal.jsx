import './Modal.css'

function Modal({ isOpen, title, children, onClose, onSubmit, submitLabel = 'Save' }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
