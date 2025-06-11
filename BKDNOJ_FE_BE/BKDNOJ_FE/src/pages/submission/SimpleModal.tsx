import { useEffect, useRef } from "react";

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SimpleModal = ({ open, onClose, children }: SimpleModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute right-1 top-1 text-4xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default SimpleModal;
