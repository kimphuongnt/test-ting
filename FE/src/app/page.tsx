"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KolInformation } from "@/models/KolInformation";
import { getKols } from "@/service/kolService";

import KolCard from "@/components/KOLCard";

import ScrollToTopButton from "@/components/ScrollToTopButton ";
import KolDetailCV from "@/components/KolDetailModal";

const LoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] pointer-events-none"
    role="status"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      <span className="text-white/90 text-sm">Đang tải dữ liệu…</span>
    </div>
  </motion.div>
);

export default function Page() {
  const [kols, setKols] = useState<KolInformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedKol, setSelectedKol] = useState<KolInformation | null>(null);

  const fetchKols = async () => {
    try {
      setLoading(true);
      const res = await getKols({
        pageIndex: currentPage,
        pageSize,
        keyword: "",
        language: "",
        active: true,
        sortBy: "CreatedDate",
        sortDir: "desc",
      });
      setKols(res.KolInformation);
      setTotalCount(res.totalCount);
      setError(null);
    } catch (e) {
      console.error("API Error:", e);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKols();
  }, [currentPage, pageSize]);

  const handleViewDetail = (kol: KolInformation) => {
    setSelectedKol(kol);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedKol(null);
    setDetailOpen(false);
  };
const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const size = Number(e.target.value);
  setPageSize(size);
  setCurrentPage(1);
  setDirection("next");
};

const handlePrev = () => {
  if (currentPage > 1) {
    setDirection("prev");
    setCurrentPage((p) => p - 1);
  }
};

const handleNext = () => {
  if (currentPage < totalPages) {
    setDirection("next");
    setCurrentPage((p) => p + 1);
  }
};
  return (
    <>
      <h1 className="header ">
        Danh sách KOLs
      </h1>

      {detailOpen && selectedKol ? (
        // ✅ Khi mở thì show chi tiết, ẩn bảng
        <KolDetailCV kol={selectedKol} onClose={handleCloseDetail} />
      ) : (
        // ✅ Khi chưa mở thì show bảng + phân trang
        <>
          <div className="relative overflow-hidden min-h-[300px] p-4 pb-10">
            {loading && <LoadingOverlay />}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${pageSize}-${loading}`}
                initial={{ x: direction === "next" ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === "next" ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative ${loading ? "opacity-70" : "opacity-100"}`}
              >
                <KolCard
                  kols={kols}
                  loading={loading}
                  error={error}
                  onView={handleViewDetail} // mở CV
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination */}
<div style={{ paddingTop: 10 }}>
  <div className="flex items-center justify-center" style={{ gap: 10, padding: "0 0 10 10" }}>
    <button
      style={{ fontSize: "18px" }}
      onClick={handlePrev}
      disabled={currentPage === 1 || loading}
      className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
        currentPage === 1 || loading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      ◀
    </button>

    <span
      className="text-gray-700 font-semibold"
      style={{ fontSize: "20px", marginLeft: 10, marginRight: 10 }}
    >
      {currentPage} / {totalPages || 1}
    </span>

    <button
      style={{ fontSize: "18px" }}
      onClick={handleNext}
      disabled={currentPage === totalPages || loading}
      className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
        currentPage === totalPages || loading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      ▶
    </button>
  </div>

  <div className="flex items-center space-x-2 justify-center mt-4">
    <label htmlFor="pageSize" className="text-gray-700" style={{ fontSize: "20px" }}>
      Số mục trên trang:
    </label>
    <select
      id="pageSize"
      value={pageSize}
      onChange={handlePageSizeChange}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ fontSize: "20px" }}
    >
      {[5, 10, 15, 20].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>
</div>

        </>
      )}

      <ScrollToTopButton />
    </>
  );
}
