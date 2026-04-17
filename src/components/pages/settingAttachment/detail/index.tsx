"use client"

import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAttachSettingDetail } from "../../../../hooks/query/attachmentSetting/detail"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatAttachmentName(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function DetailAttachmentSettingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useAttachSettingDetail(id || "")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  if (!data?.data) {
    return <p className="text-sm text-gray-500">Data tidak ditemukan.</p>
  }

  const detail = data.data

  return (
    <div className="w-full mx-auto space-y-4 py-4">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        ← Kembali
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              <polyline points="16 12 12 8 8 12" />
              <line x1="12" y1="8" x2="12" y2="20" />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatAttachmentName(detail.attachment_type)}
            </p>
            <p className="text-sm text-gray-500">
              {detail.transaction_type} · {detail.stage}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            detail.is_active
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {detail.is_active ? "Aktif" : "Tidak Aktif"}
        </span>
      </div>

      {/* Info Utama */}
      <Section title="Informasi Attachment">
        <InfoGrid>
          <InfoItem label="ID" value={detail.id} />
          <InfoItem label="Transaction Type" value={detail.transaction_type} />
          <InfoItem label="Stage" value={detail.stage} />
          <InfoItem label="Branch Code" value={detail.branch_code} />
          <InfoItem
            label="Attachment Type"
            value={formatAttachmentName(detail.attachment_type)}
          />
          <InfoItem
            label="Required"
            value={detail.is_required ? "Ya" : "Tidak"}
          />
          <InfoItem
            label="Deskripsi"
            value={detail.description}
            className="col-span-2"
          />
        </InfoGrid>
      </Section>

      {/* Status */}
      <Section title="Status">
        <InfoGrid>
          <InfoItem
            label="Aktif"
            value={detail.is_active ? "Aktif" : "Tidak Aktif"}
          />
          <InfoItem
            label="Required"
            value={detail.is_required ? "Ya" : "Tidak"}
          />
        </InfoGrid>
      </Section>

      {/* Timestamps */}
      <Section title="Riwayat">
        <InfoGrid>
          <InfoItem label="Dibuat oleh" value={detail.created_by} />
          <InfoItem label="Dibuat pada" value={formatDate(detail.created_at)} />
          <InfoItem
            label="Diperbarui pada"
            value={formatDate(detail.updated_at)}
          />
        </InfoGrid>
      </Section>
    </div>
  )
}

/* ================== HELPER ================== */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </p>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string
  value: any
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white">
        {value ?? "-"}
      </p>
    </div>
  )
}