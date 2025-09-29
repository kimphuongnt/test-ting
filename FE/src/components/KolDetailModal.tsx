"use client";

import React from "react";
import { motion } from "framer-motion";
import { KolInformation } from "@/models/KolInformation";

interface Props {
  kol: KolInformation;
  onClose: () => void;
}

const Badge = ({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "gray" | "blue" | "red" }) => {
  const map: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    gray: "bg-gray-100 text-gray-700 ring-gray-400/30",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
    red: "bg-rose-50 text-rose-700 ring-rose-600/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${map[tone]}`}>
      {children}
    </span>
  );
};

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-12 gap-3 py-2">
    <div className="col-span-4 md:col-span-3 text-sm text-gray-500">{label}</div>
    <div className="col-span-8 md:col-span-9 text-sm text-gray-900 break-words">{value ?? "—"}</div>
  </div>
);

const money = (n?: number | string | null) => {
  if (n === undefined || n === null || n === "") return "—";
  const x = typeof n === "string" ? Number(n) : n;
  return Number.isFinite(x) ? `$${x.toLocaleString("en-US")}` : String(n);
};

export default function KolDetailCV({ kol, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[70vh] px-4 py-6 md:px-8"
    >
      {/* Header / Hero */}
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400">
          {/* top pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-15 [background:radial-gradient(circle_at_20%_20%,white_0,rgba(255,255,255,0)_40%),radial-gradient(circle_at_80%_30%,white_0,rgba(255,255,255,0)_35%),radial-gradient(circle_at_60%_80%,white_0,rgba(255,255,255,0)_35%)]" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={kol?.portraitURL || "/placeholder-avatar.png"}
              alt="portrait"
              className="h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover ring-2 ring-white/40 shadow-xl"
            />
            <div className="flex-1 text-white">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {kol?.code || `#${kol?.kolID}`}
                </h1>
                {kol?.verificationStatus ? (
                  <Badge tone="blue">Đã xác minh ✅</Badge>
                ) : (
                  <Badge tone="gray">Chưa xác minh ❌</Badge>
                )}
                {kol?.isOnBoarding ? (
                  <Badge tone="emerald">Đang onboard</Badge>
                ) : (
                  <Badge tone="gray">Chưa onboard</Badge>
                )}
                {kol?.livenessStatus ? <Badge tone="emerald">Liveness OK</Badge> : <Badge tone="red">Liveness No</Badge>}
              </div>

              <p className="mt-1 text-white/85">
                Ngôn ngữ: <span className="font-medium">{kol?.language?.toUpperCase() || "—"}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="emerald">
                  {kol?.expectedSalaryEnable ? <>Mức kỳ vọng: <strong className="ml-1">{money(kol.expectedSalary)}</strong></> : "Ẩn mức kỳ vọng"}
                </Badge>
                <Badge tone="gray">ChannelTypeID: {kol?.channelSettingTypeID ?? "—"}</Badge>
                <Badge tone="gray">{kol?.active ? "Active" : "Inactive"}</Badge>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="self-start md:self-auto rounded-xl bg-white/15 hover:bg-white/25 text-white px-4 py-2 text-sm font-medium ring-1 ring-white/25 backdrop-blur transition-colors"
              aria-label="Đóng"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto mt-6 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Education / Summary */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Thông tin học vấn</h2>
            <div className="mt-3 text-sm text-gray-800">{kol?.education || "—"}</div>
          </section>

          {/* Activity & Metadata */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Hoạt động & Lịch sử</h2>
            <div className="mt-3">
              <Row label="Ngày Active" value={kol?.activeDate ? new Date(kol.activeDate).toLocaleString("vi-VN") : "—"} />
              <Row label="Trạng thái" value={kol?.active ? "Active" : "Inactive"} />
              <Row label="Tạo bởi" value={kol?.createdBy} />
              <Row label="Ngày tạo" value={kol?.createdDate ? new Date(kol.createdDate).toLocaleString("vi-VN") : "—"} />
              <Row label="Sửa bởi" value={kol?.modifiedBy} />
              <Row label="Ngày sửa" value={kol?.modifiedDate ? new Date(kol.modifiedDate).toLocaleString("vi-VN") : "—"} />
            </div>
          </section>

          {/* Financial / IDs */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Tài chính & Liên quan</h2>
            <div className="mt-3">
              <Row label="Mức lương kỳ vọng" value={kol?.expectedSalaryEnable ? money(kol.expectedSalary) : "Ẩn"} />
              <Row label="PaymentMethodID" value={kol?.paymentMethodID} />
              <Row label="RewardID" value={kol?.rewardID} />
              <Row label="TestimonialsID" value={kol?.testimonialsID} />
              <Row label="ChannelSettingTypeID" value={kol?.channelSettingTypeID} />
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Identity images */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Hình ảnh / Giấy tờ</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { label: "ID Front", url: kol?.iDFrontURL },
                { label: "ID Back", url: kol?.iDBackURL },
                { label: "Portrait (Right)", url: kol?.portraitRightURL },
                { label: "Portrait (Left)", url: kol?.portraitLeftURL },
              ].map((it) => (
                <figure key={it.label} className="overflow-hidden rounded-xl ring-1 ring-black/10 bg-gray-50">
                  {it.url ? (
                    <img src={it.url} alt={it.label} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 grid place-items-center text-xs text-gray-500">Không có</div>
                  )}
                  <figcaption className="px-3 py-2 text-xs text-gray-700">{it.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Status badges */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Trạng thái</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {kol?.verificationStatus ? <Badge tone="blue">Đã xác minh ✅</Badge> : <Badge tone="gray">Chưa xác minh ❌</Badge>}
              {kol?.isOnBoarding ? <Badge tone="emerald">Đang onboard</Badge> : <Badge tone="gray">Chưa onboard</Badge>}
              {kol?.livenessStatus ? <Badge tone="emerald">Liveness OK</Badge> : <Badge tone="red">Liveness No</Badge>}
              <Badge tone="gray">{kol?.enabled ? "Enabled" : "Disabled"}</Badge>
              <Badge tone="gray">{kol?.isRemove ? "Marked remove" : "Normal"}</Badge>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
