"use client";

import React from "react";
import { motion } from "framer-motion";
import { KolInformation } from "@/models/KolInformation";
import "./KolDetailCV.css";

interface Props {
  kol: KolInformation;
  onClose: () => void;
}

type Tone = "emerald" | "gray" | "blue" | "red";

const Badge = ({ children, tone = "emerald" }: { children: React.ReactNode; tone?: Tone }) => (
  <span className={`kcv-badge kcv-badge--${tone}`}>{children}</span>
);

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="kcv-row">
    <div className="kcv-row__label">{label}</div>
    <div className="kcv-row__value">{value ?? "—"}</div>
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
      className="kcv"
    >
      {/* Header */}
      <div className="kcv-container">
        <div className="kcv-hero">
          <div className="kcv-hero__pattern" />
          <div className="kcv-hero__body">
            <img
              src={kol?.portraitURL || "/placeholder-avatar.png"}
              alt="portrait"
              className="kcv-avatar"
            />

            <div className="kcv-hero__text">
              <div className="kcv-hero__titlewrap">
                <h1 className="kcv-hero__title">{kol?.code || `#${kol?.kolID}`}</h1>
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
                {kol?.livenessStatus ? (
                  <Badge tone="emerald">Liveness OK</Badge>
                ) : (
                  <Badge tone="red">Liveness No</Badge>
                )}
              </div>

              <p className="kcv-hero__sub">
                Ngôn ngữ: <span className="kcv-hero__highlight">{kol?.language?.toUpperCase() || "—"}</span>
              </p>

              <div className="kcv-hero__badges">
                <Badge tone="emerald">
                  {kol?.expectedSalaryEnable ? (
                    <>Mức kỳ vọng: <strong className="kcv-hero__bold">{money(kol.expectedSalary)}</strong></>
                  ) : (
                    "Ẩn mức kỳ vọng"
                  )}
                </Badge>
                <Badge tone="gray">ChannelTypeID: {kol?.channelSettingTypeID ?? "—"}</Badge>
                <Badge tone="gray">{kol?.active ? "Active" : "Inactive"}</Badge>
              </div>
            </div>

            <button
              onClick={onClose}
              className="kcv-closebtn"
              aria-label="Đóng"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="kcv-container kcv-grid">
        {/* Left */}
        <div className="kcv-col kcv-col--main">
          <section className="kcv-card">
            <h2 className="kcv-card__title">Thông tin học vấn</h2>
            <div className="kcv-card__content">{kol?.education || "—"}</div>
          </section>

          <section className="kcv-card">
            <h2 className="kcv-card__title">Hoạt động & Lịch sử</h2>
            <div className="kcv-card__content">
              <Row label="Ngày Active" value={kol?.activeDate ? new Date(kol.activeDate).toLocaleString("vi-VN") : "—"} />
              <Row label="Trạng thái" value={kol?.active ? "Active" : "Inactive"} />
              <Row label="Tạo bởi" value={kol?.createdBy} />
              <Row label="Ngày tạo" value={kol?.createdDate ? new Date(kol.createdDate).toLocaleString("vi-VN") : "—"} />
              <Row label="Sửa bởi" value={kol?.modifiedBy} />
              <Row label="Ngày sửa" value={kol?.modifiedDate ? new Date(kol.modifiedDate).toLocaleString("vi-VN") : "—"} />
            </div>
          </section>

          <section className="kcv-card">
            <h2 className="kcv-card__title">Tài chính & Liên quan</h2>
            <div className="kcv-card__content">
              <Row label="Mức lương kỳ vọng" value={kol?.expectedSalaryEnable ? money(kol.expectedSalary) : "Ẩn"} />
              <Row label="PaymentMethodID" value={kol?.paymentMethodID} />
              <Row label="RewardID" value={kol?.rewardID} />
              <Row label="TestimonialsID" value={kol?.testimonialsID} />
              <Row label="ChannelSettingTypeID" value={kol?.channelSettingTypeID} />
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="kcv-col kcv-col--side">
          <section className="kcv-card">
            <h2 className="kcv-card__title">Hình ảnh / Giấy tờ</h2>
            <div className="kcv-media">
              {[
                { label: "ID Front", url: kol?.iDFrontURL },
                { label: "ID Back", url: kol?.iDBackURL },
                { label: "Portrait (Right)", url: kol?.portraitRightURL },
                { label: "Portrait (Left)", url: kol?.portraitLeftURL },
              ].map((it) => (
                <figure key={it.label} className="kcv-fig">
                  {it.url ? (
                    <img src={it.url} alt={it.label} className="kcv-fig__img" />
                  ) : (
                    <div className="kcv-fig__placeholder">Không có</div>
                  )}
                  <figcaption className="kcv-fig__cap">{it.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="kcv-card">
            <h2 className="kcv-card__title">Trạng thái</h2>
            <div className="kcv-card__content kcv-badgewrap">
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
