"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ImageViewerProps {
  selectedImage: string;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export default function ImageViewer({
  selectedImage,
  onNext,
  onPrev,
  onClose,
}: ImageViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-sm uppercase tracking-widest opacity-70 hover:opacity-100"
      >
        Close
      </button>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-6 text-white text-2xl opacity-60 hover:opacity-100"
      >
        ←
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-6 text-white text-2xl opacity-60 hover:opacity-100"
      >
        →
      </button>

      {/* Image */}
      <div className="relative w-[90vw] h-[80vh]">
        <Image
          src={selectedImage}
          alt="Expanded view"
          fill
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}
