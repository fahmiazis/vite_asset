import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FlowStep } from '../../../../models/approval/detail'
import type { UpdateFlowStepRequest } from '../../../../models/approval/updateStep'
import { Inputs } from '../../../molecules/input/inputs'
import { Selects } from '../../../molecules/input/selects'
import {
  stepRole,
  stepType,
  stepCategory,
  stepApprovalWay,
} from '../../../../constans/approval'
import { useRoleList } from '../../../../hooks/query/role/list'
import { roleListToSelectOptions } from '../../../../utils/role'

interface EditStepModalProps {
  step: FlowStep
  isPending?: boolean
  onClose: () => void
  onSubmit: (data: UpdateFlowStepRequest) => void
}

/**
 * Edit satu approval step → PUT /approval-flow-steps/:id.
 * Semua field di dto.UpdateApprovalFlowStepRequest adalah pointer, jadi field
 * yang tidak berubah sengaja tidak ikut dikirim (biar tidak ketimpa).
 */
export default function EditStepModal({
  step,
  isPending,
  onClose,
  onSubmit,
}: EditStepModalProps) {
  const { t } = useTranslation()
  const { data: roleList } = useRoleList()

  const [form, setForm] = useState({
    step_order: step.step_order,
    step_name: step.step_name,
    step_role: step.step_role,
    role_id: step.role_id ?? '',
    structure: step.structure ?? '',
    type: step.type,
    category: step.category,
    approval_way: step.approval_way,
    is_required: step.is_required,
    can_skip: step.can_skip,
    is_visible: step.is_visible,
  })

  useEffect(() => {
    setForm({
      step_order: step.step_order,
      step_name: step.step_name,
      step_role: step.step_role,
      role_id: step.role_id ?? '',
      structure: step.structure ?? '',
      type: step.type,
      category: step.category,
      approval_way: step.approval_way,
      is_required: step.is_required,
      can_skip: step.can_skip,
      is_visible: step.is_visible,
    })
  }, [step])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: UpdateFlowStepRequest = {}
    if (form.step_order !== step.step_order) payload.step_order = form.step_order
    if (form.step_name !== step.step_name) payload.step_name = form.step_name
    if (form.step_role !== step.step_role) payload.step_role = form.step_role
    if (form.role_id !== (step.role_id ?? '')) payload.role_id = form.role_id || null
    if (form.structure !== (step.structure ?? '')) payload.structure = form.structure || null
    if (form.type !== step.type) payload.type = form.type
    if (form.category !== step.category) payload.category = form.category
    if (form.approval_way !== step.approval_way) payload.approval_way = form.approval_way
    if (form.is_required !== step.is_required) payload.is_required = form.is_required
    if (form.can_skip !== step.can_skip) payload.can_skip = form.can_skip
    if (form.is_visible !== step.is_visible) payload.is_visible = form.is_visible

    if (Object.keys(payload).length === 0) {
      onClose()
      return
    }

    onSubmit(payload)
  }

  const toggles: Array<{ key: 'is_required' | 'can_skip' | 'is_visible'; label: string }> = [
    { key: 'is_required', label: t('approvalDetail.step.isRequired') },
    { key: 'can_skip', label: t('approvalDetail.step.canSkip') },
    { key: 'is_visible', label: t('approvalDetail.step.isVisible') },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={onClose} />

      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {t('approvalDetail.editModal.title')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          {t('approvalDetail.editModal.subtitle', { name: step.step_name })}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              label={t('approvalDetail.step.order')}
              numberOnly
              value={`${form.step_order}`}
              onChange={(value) => setForm((p) => ({ ...p, step_order: Number(value) }))}
              required
            />
            <Inputs
              label={t('approvalDetail.step.name')}
              value={form.step_name}
              onChange={(value) => setForm((p) => ({ ...p, step_name: value }))}
              required
            />
            <Selects
              label={t('approvalDetail.step.role')}
              value={form.step_role}
              onChange={(value) => setForm((p) => ({ ...p, step_role: value }))}
              options={stepRole}
              required
            />
            {roleList && (
              <Selects
                label={t('approvalDetail.step.roleName')}
                value={form.role_id}
                onChange={(value) => setForm((p) => ({ ...p, role_id: value }))}
                options={roleListToSelectOptions(roleList.data)}
              />
            )}
            <Selects
              label={t('approvalDetail.step.type')}
              value={form.type}
              onChange={(value) => setForm((p) => ({ ...p, type: value }))}
              options={stepType}
            />
            <Selects
              label={t('approvalDetail.step.category')}
              value={form.category}
              onChange={(value) => setForm((p) => ({ ...p, category: value }))}
              options={stepCategory}
            />
            <Selects
              label={t('approvalDetail.step.approvalWay')}
              value={form.approval_way}
              onChange={(value) => setForm((p) => ({ ...p, approval_way: value }))}
              options={stepApprovalWay}
            />
            <Inputs
              label={t('approvalDetail.step.structure')}
              value={form.structure}
              onChange={(value) => setForm((p) => ({ ...p, structure: value }))}
              placeholder="e.g., sender_manager"
            />
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            {toggles.map((item) => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[item.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [item.key]: e.target.checked }))}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('approvalDetail.editModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPending
                ? t('approvalDetail.editModal.saving')
                : t('approvalDetail.editModal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
