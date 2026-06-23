import { MouseEvent, useRef } from "react";

import { CiCircleAlert } from "react-icons/ci";
import { motion } from "motion/react";

interface ModalProps {
  titleModal: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function Modal({
  titleModal,
  description,
  onCancel,
  onConfirm,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 min-h-screen w-full flex justify-center items-center bg-black/30 backdrop-blur-md fixed inset-0 z-50"
      onClick={handleModalClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        ref={modalRef}
        className="bg-white px-10 py-5 mx-5 rounded-md"
      >
        <CiCircleAlert size={60} color="red" className="mx-auto mb-3" />
        <p className="font-bold text-2xl text-center">{titleModal}</p>
        <p className="mt-1 text-sm text-center">{description}</p>

        <div className="flex justify-between mt-10">
          <button
            className="px-3 py-1.5 bg-red-500 hover:bg-red-700 duration-300 text-white rounded-sm uppercase cursor-pointer"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 duration-300 text-white uppercase rounded-sm cursor-pointer"
            type="button"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
