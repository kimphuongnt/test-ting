"use client";

import React from "react";
import { KolInformation } from "@/models/KolInformation";
import "./KolCard.css"; // <-- import CSS thuần

interface Props {
  kols: KolInformation[];
  loading?: boolean;
  error?: string | null;
  onView?: (kol: KolInformation) => void;
}

const Spinner = () => (
  <div className="kc-spinner-wrap" role="status" aria-label="Đang tải...">
    <div className="kc-spinner" />
  </div>
);

const formatDate = (d?: string | Date | null) => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("vi-VN");
};

const money = (n?: number | string | null) => {
  if (n === undefined || n === null || n === "") return "—";
  const x = typeof n === "string" ? Number(n) : n;
  return Number.isFinite(x) ? `$${x.toLocaleString("en-US")}` : String(n);
};

const Dot = ({ active }: { active?: boolean | null }) => (
  <span className={active ? "kc-dot kc-dot--active" : "kc-dot"} title={active ? "Active" : "Inactive"} />
);

const KolCard: React.FC<Props> = ({ kols, loading, error, onView }) => {
  const COLS = 14;

  return (
    <div className="kc-wrap">
      <div className="kc-card">
        <div className="kc-scroller">
          <table className="kc-table">
            <colgroup>
              <col style={{ width: "7rem" }} />
              <col style={{ width: "4rem" }} />
              <col style={{ width: "12rem" }} />
              <col style={{ width: "5rem" }} />
              <col style={{ width: "9rem" }} />
              <col style={{ width: "7rem" }} />
              <col style={{ width: "10rem" }} />
              
              <col style={{ width: "10rem" }} />
              <col style={{ width: "9rem" }} />
              <col style={{ width: "9rem" }} />
            </colgroup>

            <thead>
              <tr>
                {[
                  "Mã",
                  "Ngôn ngữ",
                  "Học vấn",
                  "Lương",
                  "Xác minh",
                  "Ảnh",
                  "Cập nhật gần nhất",
                  "Onboarding?",
                  "Liveness?",
                  "Xem",
                ].map((h) => (
                  <th key={h} className="kc-th" scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={COLS} className="kc-td">
                    <Spinner />
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={COLS} className="kc-td kc-center kc-error">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && kols.length === 0 && (
                <tr>
                  <td colSpan={COLS} className="kc-td kc-center kc-muted">
                    Không có KOL nào.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                kols.map((kol, i) => (
                  <tr key={kol.kolID ?? i} className="kc-tr">
                    <td className="kc-td kc-truncate">{kol.code ?? "—"}</td>
                    <td className="kc-td kc-truncate">
                      <span className="kc-strong">{kol.language ? kol.language.toUpperCase() : "—"}</span>
                    </td>
                    <td className="kc-td kc-truncate">{kol.education ?? "—"}</td>
                    <td className="kc-td kc-truncate">{kol.expectedSalaryEnable ? money(kol.expectedSalary) : "Ẩn"}</td>
                    <td className="kc-td">
                      <span className={kol.verificationStatus ? "kc-chip kc-chip--ok" : "kc-chip kc-chip--gray"}>
                        <span className="kc-chip-emoji">{kol.verificationStatus ? "✅" : "❌"}</span>
                        {kol.verificationStatus ? "Đã xác minh" : "Chưa"}
                      </span>
                    </td>
                    <td className="kc-td kc-center">
                      {kol.portraitURL ? (
                        <img
                          src={kol.portraitURL}
                          alt="portrait"
                          className="kc-avatar"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="kc-avatar kc-avatar--placeholder" />
                      )}
                    </td>
                    <td className="kc-td kc-truncate">{formatDate(kol.modifiedDate?.toString())}</td>
                    <td className="kc-td">
                      <span className={kol.isOnBoarding ? "kc-chip kc-chip--ok" : "kc-chip kc-chip--gray"}>
                        {kol.isOnBoarding ? "Đang onboard" : "Chưa"}
                      </span>
                    </td>
                    <td className="kc-td">
                      <span className={kol.livenessStatus ? "kc-chip kc-chip--ok" : "kc-chip kc-chip--gray"}>
                        {kol.livenessStatus ? "OK" : "No"}
                      </span>
                    </td>
                    <td className="kc-td kc-center">
                      <button
                        type="button"
                        onClick={() => onView?.(kol)}
                        className="kc-link"
                        title="Xem chi tiết"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KolCard;
