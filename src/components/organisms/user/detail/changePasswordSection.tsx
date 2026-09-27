import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useChangeMyPassword,
  useSetUserPassword,
} from "../../../../hooks/mutation/user/useProfile"

interface ChangePasswordSectionProps {
  userId: string
  /** true = ganti password sendiri (wajib password lama); false = admin */
  self?: boolean
  className?: string
}

const MIN_LENGTH = 6

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"

export default function ChangePasswordSection({
  userId,
  self = false,
  className = "",
}: ChangePasswordSectionProps) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")

  const reset = () => {
    setCurrent("")
    setNext("")
    setConfirm("")
  }

  const changeMine = useChangeMyPassword(reset)
  const setForUser = useSetUserPassword(userId, reset)
  const isPending = changeMine.isPending || setForUser.isPending

  const tooShort = next.length > 0 && next.length < MIN_LENGTH
  const mismatch = confirm.length > 0 && next !== confirm
  const canSubmit =
    !isPending &&
    next.length >= MIN_LENGTH &&
    next === confirm &&
    (!self || current.length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    if (self) changeMine.mutate({ current_password: current, new_password: next })
    else setForUser.mutate(next)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("userProfile.password.title")}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {t(self ? "userProfile.password.subtitleSelf" : "userProfile.password.subtitleAdmin")}
        </p>
      </div>

      <div className="space-y-3">
        {self && (
          <label className="block">
            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("userProfile.password.current")}
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        <label className="block">
          <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("userProfile.password.new")}
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={inputClass}
          />
          {tooShort && (
            <span className="block text-xs text-red-500 mt-1">
              {t("userProfile.password.tooShort", { min: MIN_LENGTH })}
            </span>
          )}
        </label>

        <label className="block">
          <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("userProfile.password.confirm")}
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
          {mismatch && (
            <span className="block text-xs text-red-500 mt-1">
              {t("userProfile.password.mismatch")}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? t("userBranch.saving") : t("userProfile.password.submit")}
        </button>
      </div>
    </form>
  )
}
