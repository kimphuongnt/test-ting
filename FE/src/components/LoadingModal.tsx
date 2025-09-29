"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  message?: string;
};

export default function LoadingModal({ open, message = "Đang tải dữ liệu…" }: Props) {
  // Khóa scroll khi mở modal
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-[101] grid place-items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Đang tải"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="w-full max-w-xs rounded-2xl bg-white shadow-xl ring-1 ring-black/10 p-6 text-center">
              <div
                className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"
                role="status"
                aria-label="Loading spinner"
              />
              <p className="text-sm font-medium text-gray-800">{message}</p>
              <p className="mt-1 text-xs text-gray-500">Vui lòng đợi trong giây lát…</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
