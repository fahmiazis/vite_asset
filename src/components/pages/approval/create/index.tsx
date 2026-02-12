// src/pages/approval/create/CreateApprovalFlow.tsx
import Head from '../../../molecules/head'
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useState } from 'react'
import type { CreateApprovalFlowRequest } from '../../../../models/approval/create'
import toast from 'react-hot-toast'
import { Selects } from '../../../molecules/input/selects'
import { useUserList } from '../../../../hooks/query/user/list'
import { useRoleList } from '../../../../hooks/query/role/list'
import { MultiSelect } from '../../../molecules/input/multiSelect'
import { roleListToSelectOptions } from '../../../../utils/role'
import { userListToSelectOptions } from '../../../../utils/user'
import { Textareas } from '../../../molecules/input/textAreas'
import { useCreateApprovalFlow } from '../../../../hooks/mutation/approval/useCreateApproval'

export default function CreateApprovalFlow() {
  const [formData, setFormData] = useState({
    flow_code: '',
    flow_name: '',
    approval_way: '',
    assignment_type: '',
    assigned_user_id: '',
    allowed_creator_roles: [] as string[],
    description: '',
  })

  // Fetch user and role list
  const { data: userList, isLoading: isLoadingUsers } = useUserList()
  const { data: roleList, isLoading: isLoadingRoles } = useRoleList()

  // Create mutation
  const createApprovalFlowMutation = useCreateApprovalFlow({
    redirectOnSuccess: true,
    redirectPath: '/dashboard/approval',
  })

  // Convert to select options
  const userOptions = userList?.data ? userListToSelectOptions(userList.data) : []
  const roleOptions = roleList?.data ? roleListToSelectOptions(roleList.data) : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi required fields
    if (!formData.flow_code.trim()) {
      toast.error('Flow Code is required')
      return
    }

    if (!formData.flow_name.trim()) {
      toast.error('Flow Name is required')
      return
    }

    if (!formData.approval_way.trim()) {
      toast.error('Approval Way is required')
      return
    }

    if (!formData.assignment_type.trim()) {
      toast.error('Assignment Type is required')
      return
    }

    if (!formData.assigned_user_id) {
      toast.error('Assigned User is required')
      return
    }

    if (!formData.allowed_creator_roles || formData.allowed_creator_roles.length === 0) {
      toast.error('At least one Allowed Creator Role is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }

    // Build payload dengan static boolean values
    const payload: CreateApprovalFlowRequest = {
      flow_code: formData.flow_code.trim(),
      flow_name: formData.flow_name.trim(),
      approval_way: formData.approval_way.trim(),
      assignment_type: formData.assignment_type.trim(),
      assigned_user_id: formData.assigned_user_id,
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
      <Head label="Create Approval Flow" />

      <form onSubmit={handleSubmit}>
        <section className="flex gap-4 mt-4">
          <div className="w-1/2 flex flex-col gap-4">
            <Inputs
              label="Flow Code"
              value={formData.flow_code}
              onChange={(value) => setFormData((prev) => ({ ...prev, flow_code: value }))}
              placeholder="e.g., procurement"
              required
            />
            <Inputs
              label="Flow Name"
              value={formData.flow_name}
              onChange={(value) => setFormData((prev) => ({ ...prev, flow_name: value }))}
              placeholder="e.g., procurement request"
              required
            />
          </div>

          <div className="w-1/2 flex flex-col gap-4">
            <Inputs
              label="Approval Way"
              value={formData.approval_way}
              onChange={(value) => setFormData((prev) => ({ ...prev, approval_way: value }))}
              placeholder="e.g., sequential"
              required
            />
            <Inputs
              label="Assignment Type"
              value={formData.assignment_type}
              onChange={(value) => setFormData((prev) => ({ ...prev, assignment_type: value }))}
              placeholder="e.g., general"
              required
            />
          </div>
        </section>

        {/* Row 2: Assigned User & Allowed Creator Roles */}
        <section className="flex gap-4 mt-4">
          <div className="w-1/2">
            <Selects
              label="Assigned User"
              options={userOptions}
              value={formData.assigned_user_id}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  assigned_user_id: selected || '',
                }))
              }
              placeholder="Select user..."
              disabled={isLoadingUsers}
              required
            />
          </div>

          <div className="w-1/2">
            <MultiSelect
              label="Allowed Creator Roles"
              options={roleOptions}
              value={formData.allowed_creator_roles}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  allowed_creator_roles: selected.map((s) => s),
                }))
              }
              placeholder="Select roles..."
              disabled={isLoadingRoles}
              required
            />
          </div>
        </section>

        {/* Row 3: Description */}
        <section className="mt-4">
          <Textareas
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            placeholder="Enter description..."
            rows={6}
            maxLength={500}
            helperText="Maximum 500 characters"
            required
          />
        </section>

        {/* Info Static Values */}
        <section className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> The following values will be set automatically:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
            <li>
              Is Customizable: <strong>true</strong>
            </li>
            <li>
              Is Active: <strong>true</strong>
            </li>
          </ul>
        </section>

        {/* Buttons */}
        <div className="mt-6 flex gap-2">
          <Buttons
            label={createApprovalFlowMutation.isPending ? 'Creating...' : 'Create Approval Flow'}
            disable={createApprovalFlowMutation.isPending || isLoading}
            onClick={handleSubmit}
          />
          <Buttons
            label="Cancel"
            disable={createApprovalFlowMutation.isPending}
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  )
}