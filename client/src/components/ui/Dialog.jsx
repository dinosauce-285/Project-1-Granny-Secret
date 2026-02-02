import { createPortal } from "react-dom";
import { useEffect } from "react";

function Dialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmStyle = "primary",
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Enter") {
          if (
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          if (onConfirm) onConfirm();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCancel) onCancel();
    onClose();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const confirmButtonStyles = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900 font-inter">
            {title}
          </h2>
        </div>
        <div className="px-6 pb-6">
          {message && <p className="text-gray-600 mb-4">{message}</p>}
          {children}
        </div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${confirmButtonStyles[confirmStyle]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>,
    document.body,
  );
}

export default Dialog;
