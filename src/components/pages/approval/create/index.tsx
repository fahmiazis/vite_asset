// src/pages/approval/create/CreateApprovalFlow.tsx
import Head from '../../../molecules/head'
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useMemo, useState } from 'react'
import type { CreateApprovalFlowRequest } from '../../../../models/approval/create'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Selects } from '../../../molecules/input/selects'
import { useUserList } from '../../../../hooks/query/user/list'
import { useRoleList } from '../../../../hooks/query/role/list'
import { useApprovalFlowList } from '../../../../hooks/query/approval/list'
import { MultiSelect } from '../../../molecules/input/multiSelect'
import { roleListToSelectOptions } from '../../../../utils/role'
import { userListToSelectOptions } from '../../../../utils/user'
import { Textareas } from '../../../molecules/input/textAreas'
import { useCreateApprovalFlow } from '../../../../hooks/mutation/approval/useCreateApproval'
import { flowCode, approvalWay, assignmentType } from '../../../../constans/approval'

export default function CreateApprovalFlow() {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    flow_code: '',
    flow_name: '',
    approval_way: 'sequential',
    assignment_type: 'general',
    assigned_user_id: '',
    allowed_creator_roles: [] as string[],
    description: '',
  })

  // Fetch user and role list
  const { data: userList, isLoading: isLoadingUsers } = useUserList()
  const { data: roleList, isLoading: isLoadingRoles } = useRoleList()
  // dipakai untuk menandai flow_code yang sudah terpakai
  const { data: flowList } = useApprovalFlowList()

  // Create mutation
  const createApprovalFlowMutation = useCreateApprovalFlow({
    redirectOnSuccess: true,
    redirectPath: '/dashboard/approval',
  })

  // Convert to select options
  const userOptions = userList?.data ? userListToSelectOptions(userList.data) : []
  const roleOptions = roleList?.data ? roleListToSelectOptions(roleList.data) : []

  // (flow_code, branch_code) unik di DB dan halaman ini selalu memakai branch
  // default 'ALL' — jadi kode yang sudah ada ditandai supaya tidak gagal di server
  const usedCodes = useMemo(
    () => new Set((flowList?.data ?? []).map((flow) => flow.flow_code)),
    [flowList]
  )

  const flowCodeOptions = useMemo(
    () =>
      flowCode.map((option) => ({
        ...option,
        label: usedCodes.has(String(option.value))
          ? `${option.label} — ${t('approvalCreate.flowCodeUsed')}`
          : option.label,
      })),
    [usedCodes, t]
  )

  // info langsung di bawah field, tidak menunggu tombol Simpan ditekan
  const flowCodeError =
    formData.flow_code && usedCodes.has(formData.flow_code)
      ? t('approvalCreate.validation.flowCodeDuplicate')
      : undefined

  // assigned_user_id hanya wajib kalau assignment_type = user_specific
  // (services.CreateApprovalFlow menolak kalau kosong)
  const needsAssignedUser = formData.assignment_type === 'user_specific'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.flow_code) {
      toast.error(t('approvalCreate.validation.flowCode'))
      return
    }

    if (usedCodes.has(formData.flow_code)) {
      toast.error(t('approvalCreate.validation.flowCodeDuplicate'))
      return
    }

    if (!formData.flow_name.trim()) {
      toast.error(t('approvalCreate.validation.flowName'))
      return
    }

    if (!formData.approval_way) {
      toast.error(t('approvalCreate.validation.approvalWay'))
      return
    }

    if (!formData.assignment_type) {
      toast.error(t('approvalCreate.validation.assignmentType'))
      return
    }

    if (needsAssignedUser && !formData.assigned_user_id) {
      toast.error(t('approvalCreate.validation.assignedUser'))
      return
    }

    if (!formData.allowed_creator_roles || formData.allowed_creator_roles.length === 0) {
      toast.error(t('approvalCreate.validation.creatorRoles'))
      return
    }

    if (!formData.description.trim()) {
      toast.error(t('approvalCreate.validation.description'))
      return
    }

    // Build payload dengan static boolean values
    const payload: CreateApprovalFlowRequest = {
      flow_code: formData.flow_code,
      flow_name: formData.flow_name.trim(),
      approval_way: formData.approval_way,
      assignment_type: formData.assignment_type,
      // null, bukan '' — kolomnya char(36) nullable, string kosong bikin data sampah
      assigned_user_id: needsAssignedUser ? formData.assigned_user_id : null,
      is_customizable: true,
      allowed_creator_roles: formData.allowed_creator_roles,
      description: formData.description.trim(),
      is_active: true,
    }

    createApprovalFlowMutation.mutate(payload)
  }

  const handleCancel = () => {
    window.history.back()
  }

  // Loading state
  const isLoading = isLoadingUsers || isLoadingRoles

  return (
    <div>
      <Head label={t('approvalCreate.title')} />

      <form onSubmit={handleSubmit}>
        <section className="flex gap-4 mt-4">
          <div className="w-1/2 flex flex-col gap-4">
            <Selects
              label={t('approvalCreate.flowCode')}
              value={formData.flow_code}
              onChange={(value) => setFormData((prev) => ({ ...prev, flow_code: value }))}
              options={flowCodeOptions}
              placeholder={t('approvalCreate.flowCodePlaceholder')}
              error={flowCodeError}
              helperText={flowCodeError ? undefined : t('approvalCreate.flowCodeHelper')}
              required
            />
            <Inputs
              label={t('approvalCreate.flowName')}
              value={formData.flow_name}
              onChange={(value) => setFormData((prev) => ({ ...prev, flow_name: value }))}
              placeholder="e.g., procurement request approval"
              required
            />
          </div>

          <div className="w-1/2 flex flex-col gap-4">
            <Selects
              label={t('approvalCreate.approvalWay')}
              value={formData.approval_way}
              onChange={(value) => setFormData((prev) => ({ ...prev, approval_way: value }))}
              options={approvalWay}
              required
            />
            <Selects
              label={t('approvalCreate.assignmentType')}
              value={formData.assignment_type}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  assignment_type: value,
                  // reset kalau balik ke general — backend tidak memakainya
                  assigned_user_id: value === 'user_specific' ? prev.assigned_user_id : '',
                }))
              }
              options={assignmentType}
              required
            />
          </div>
        </section>

        {/* Row 2: Assigned User & Allowed Creator Roles */}
        <section className="flex gap-4 mt-4">
          <div className="w-1/2">
            <Selects
              label={t('approvalCreate.assignedUser')}
              options={userOptions}
              value={formData.assigned_user_id}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  assigned_user_id: selected || '',
                }))
              }
              placeholder={t('approvalCreate.assignedUserPlaceholder')}
              helperText={
                needsAssignedUser
                  ? undefined
                  : t('approvalCreate.assignedUserHelper')
              }
              disabled={isLoadingUsers || !needsAssignedUser}
              required={needsAssignedUser}
            />
          </div>

          <div className="w-1/2">
            <MultiSelect
              label={t('approvalCreate.creatorRoles')}
              options={roleOptions}
              value={formData.allowed_creator_roles}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  allowed_creator_roles: selected.map((s) => s),
                }))
              }
              placeholder={t('approvalCreate.creatorRolesPlaceholder')}
              disabled={isLoadingRoles}
              required
            />
          </div>
        </section>

        {/* Row 3: Description */}
        <section className="mt-4">
          <Textareas
            label={t('approvalCreate.description')}
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            placeholder={t('approvalCreate.descriptionPlaceholder')}
            rows={6}
            maxLength={500}
            helperText={t('approvalCreate.descriptionHelper')}
            required
          />
        </section>

        {/* Info Static Values */}
        <section className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>{t('approvalCreate.note')}</strong> {t('approvalCreate.noteDesc')}
          </p>
          <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mt-2">
            <li>is_customizable: <strong>true</strong></li>
            <li>is_active: <strong>true</strong></li>
            <li>branch_code: <strong>ALL</strong></li>
          </ul>
        </section>

        {/* Buttons */}
        <div className="mt-6 flex gap-2">
          <Buttons
            label={
              createApprovalFlowMutation.isPending
                ? t('approvalCreate.creating')
                : t('approvalCreate.submit')
            }
            disable={createApprovalFlowMutation.isPending || isLoading || !!flowCodeError}
            onClick={handleSubmit}
          />
          <Buttons
            label={t('approvalCreate.cancel')}
            disable={createApprovalFlowMutation.isPending}
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  )
}
