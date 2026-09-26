import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Head from '../../../molecules/head'
import Buttons from '../../../atoms/buttons'
import { Inputs } from '../../../molecules/input/inputs'
import { Selects } from '../../../molecules/input/selects'
import { MultiSelect } from '../../../molecules/input/multiSelect'
import { Textareas } from '../../../molecules/input/textAreas'
import { useApprovalFlowDetail } from '../../../../hooks/query/approval/detail'
import { useUpdateApprovalFlow } from '../../../../hooks/mutation/approval/useUpdateApprovalFlow'
import { useUserList } from '../../../../hooks/query/user/list'
import { useRoleList } from '../../../../hooks/query/role/list'
import { roleListToSelectOptions } from '../../../../utils/role'
import { userListToSelectOptions } from '../../../../utils/user'
import { approvalWay, assignmentType } from '../../../../constans/approval'
import type { UpdateApprovalFlowRequest } from '../../../../models/approval/update'

/** `allowed_creator_roles` disimpan sebagai string JSON di DB, bukan array */
function parseCreatorRoles(raw?: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export default function EditApprovalFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading } = useApprovalFlowDetail(id || '')
  const flow = data?.data

  const updateFlow = useUpdateApprovalFlow(id || '')
  const { data: userList, isLoading: isLoadingUsers } = useUserList()
  const { data: roleList, isLoading: isLoadingRoles } = useRoleList()

  const userOptions = userList?.data ? userListToSelectOptions(userList.data) : []
  const roleOptions = roleList?.data ? roleListToSelectOptions(roleList.data) : []

  const [form, setForm] = useState({
    flow_name: '',
    approval_way: 'sequential',
    assignment_type: 'general',
    assigned_user_id: '',
    allowed_creator_roles: [] as string[],
    description: '',
    is_customizable: false,
    is_active: true,
  })

  // isi form begitu detail datang
  useEffect(() => {
    if (!flow) return
    setForm({
      flow_name: flow.flow_name ?? '',
      approval_way: flow.approval_way || 'sequential',
      assignment_type: flow.assignment_type || 'general',
      assigned_user_id: flow.assigned_user_id ?? '',
      allowed_creator_roles: parseCreatorRoles(flow.allowed_creator_roles),
      description: flow.description ?? '',
      is_customizable: !!flow.is_customizable,
      is_active: !!flow.is_active,
    })
  }, [flow])

  const needsAssignedUser = form.assignment_type === 'user_specific'

  const initialRoles = useMemo(
    () => parseCreatorRoles(flow?.allowed_creator_roles),
    [flow]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!flow) return

    if (!form.flow_name.trim()) {
      toast.error(t('approvalCreate.validation.flowName'))
      return
    }

    if (needsAssignedUser && !form.assigned_user_id) {
      toast.error(t('approvalCreate.validation.assignedUser'))
      return
    }

    if (form.allowed_creator_roles.length === 0) {
      toast.error(t('approvalCreate.validation.creatorRoles'))
      return
    }

    if (!form.description.trim()) {
      // backend menganggap string kosong = "tidak diubah", jadi deskripsi
      // memang tidak bisa dikosongkan lewat endpoint ini
      toast.error(t('approvalCreate.validation.description'))
      return
    }

    // flow_code sengaja tidak pernah ikut — lihat models/approval/update.ts
    const payload: UpdateApprovalFlowRequest = {}
    if (form.flow_name.trim() !== flow.flow_name) payload.flow_name = form.flow_name.trim()
    if (form.approval_way !== flow.approval_way) payload.approval_way = form.approval_way
    if (form.assignment_type !== flow.assignment_type) payload.assignment_type = form.assignment_type
    if (form.assigned_user_id !== (flow.assigned_user_id ?? '')) {
      payload.assigned_user_id = needsAssignedUser ? form.assigned_user_id : null
    }
    if (form.description.trim() !== flow.description) payload.description = form.description.trim()
    if (form.is_customizable !== !!flow.is_customizable) payload.is_customizable = form.is_customizable
    if (form.is_active !== !!flow.is_active) payload.is_active = form.is_active

    const rolesChanged =
      form.allowed_creator_roles.length !== initialRoles.length ||
      form.allowed_creator_roles.some((role) => !initialRoles.includes(role))
    if (rolesChanged) payload.allowed_creator_roles = form.allowed_creator_roles

    if (Object.keys(payload).length === 0) {
      toast(t('approvalEdit.noChanges'))
      return
    }

    updateFlow.mutate(payload, {
      onSuccess: () => navigate('/dashboard/approval'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!flow) return null

  return (
    <div>
      <Head label={t('approvalEdit.title')} />

      <form onSubmit={handleSubmit}>
        <section className="flex gap-4 mt-4">
          <div className="w-1/2 flex flex-col gap-4">
            <Inputs
              label={t('approvalCreate.flowCode')}
              value={flow.flow_code}
              readOnly
              helperText={t('approvalEdit.flowCodeLocked')}
              inputClassName="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
            <Inputs
              label={t('approvalCreate.flowName')}
              value={form.flow_name}
              onChange={(value) => setForm((p) => ({ ...p, flow_name: value }))}
              required
            />
          </div>

          <div className="w-1/2 flex flex-col gap-4">
            <Selects
              label={t('approvalCreate.approvalWay')}
              value={form.approval_way}
              onChange={(value) => setForm((p) => ({ ...p, approval_way: value }))}
              options={approvalWay}
              required
            />
            <Selects
              label={t('approvalCreate.assignmentType')}
              value={form.assignment_type}
              onChange={(value) =>
                setForm((p) => ({
                  ...p,
                  assignment_type: value,
                  assigned_user_id: value === 'user_specific' ? p.assigned_user_id : '',
                }))
              }
              options={assignmentType}
              required
            />
          </div>
        </section>

        <section className="flex gap-4 mt-4">
          <div className="w-1/2">
            <Selects
              label={t('approvalCreate.assignedUser')}
              options={userOptions}
              value={form.assigned_user_id}
              onChange={(selected) =>
                setForm((p) => ({ ...p, assigned_user_id: selected || '' }))
              }
              placeholder={t('approvalCreate.assignedUserPlaceholder')}
              helperText={needsAssignedUser ? undefined : t('approvalCreate.assignedUserHelper')}
              disabled={isLoadingUsers || !needsAssignedUser}
              required={needsAssignedUser}
            />
          </div>

          <div className="w-1/2">
            <MultiSelect
              label={t('approvalCreate.creatorRoles')}
              options={roleOptions}
              value={form.allowed_creator_roles}
              onChange={(selected) =>
                setForm((p) => ({ ...p, allowed_creator_roles: selected.map((s) => s) }))
              }
              placeholder={t('approvalCreate.creatorRolesPlaceholder')}
              disabled={isLoadingRoles}
              required
            />
          </div>
        </section>

        <section className="mt-4">
          <Textareas
            label={t('approvalCreate.description')}
            value={form.description}
            onChange={(value) => setForm((p) => ({ ...p, description: value }))}
            placeholder={t('approvalCreate.descriptionPlaceholder')}
            rows={6}
            maxLength={500}
            helperText={t('approvalEdit.descriptionHelper')}
            required
          />
        </section>

        <section className="flex flex-wrap gap-5 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('approvalEdit.isActive')}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_customizable}
              onChange={(e) => setForm((p) => ({ ...p, is_customizable: e.target.checked }))}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('approvalEdit.isCustomizable')}
            </span>
          </label>
        </section>

        {!form.is_active && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            {t('approvalEdit.inactiveWarning')}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          <Buttons
            label={updateFlow.isPending ? t('approvalEdit.saving') : t('approvalEdit.submit')}
            disable={updateFlow.isPending}
            onClick={handleSubmit}
          />
          <Buttons
            label={t('approvalCreate.cancel')}
            disable={updateFlow.isPending}
            onClick={() => navigate('/dashboard/approval')}
          />
        </div>
      </form>
    </div>
  )
}
