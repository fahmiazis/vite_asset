import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Buttons from "../../../../atoms/buttons";
import Head from "../../../../molecules/head";
import { useCreateFlowStep } from "../../../../../hooks/mutation/approval/useCreateApprovalStep";
import { Inputs } from "../../../../molecules/input/inputs";
import { Selects } from "../../../../molecules/input/selects";
import {
    stepRole,
    stepType,
    stepCategory,
    stepApprovalWay,
} from "../../../../../constans/approval";
import { useRoleList } from "../../../../../hooks/query/role/list";
import { roleListToSelectOptions } from "../../../../../utils/role";

export default function CreateStepApproval() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { id } = useParams()
    const createFlowStep = useCreateFlowStep()

    const { data: roleList } = useRoleList()

    const [formData, setFormData] = useState({
        step_order: 1,
        step_name: '',
        step_role: '',
        role_id: '',
        structure: '',
        // default sama dengan default kolom di DB
        type: 'all',
        category: 'all',
        approval_way: 'web',
        is_required: true,
        can_skip: false,
        is_visible: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!id) {
            console.error('Flow ID is required')
            return
        }

        const payload = {
            flow_id: id,
            step_order: formData.step_order,
            step_name: formData.step_name,
            step_role: formData.step_role,
            role_id: formData.role_id,
            structure: formData.structure,
            type: formData.type,
            category: formData.category,
            approval_way: formData.approval_way,
            // FIX: backend membaca `is_required` (snake_case), bukan `isRequired`
            is_required: formData.is_required,
            can_skip: formData.can_skip,
            is_visible: formData.is_visible,
        }

        createFlowStep.mutate(payload, {
            onSuccess: () => {
                // Navigate back to flow detail page
                navigate(`/dashboard/approval/${id}`)
            },
        })
    }

    const toggles: Array<{ key: 'is_required' | 'can_skip' | 'is_visible'; label: string }> = [
        { key: 'is_required', label: t('approvalDetail.step.isRequired') },
        { key: 'can_skip', label: t('approvalDetail.step.canSkip') },
        { key: 'is_visible', label: t('approvalDetail.step.isVisible') },
    ]

    return (
        <div>
            <Head label={t('approvalDetail.createStep.title')} className="mb-4" />

            <form onSubmit={handleSubmit}>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Inputs
                        label={t('approvalDetail.step.order')}
                        numberOnly
                        value={`${formData.step_order}`}
                        onChange={(value) => setFormData((prev) => ({ ...prev, step_order: Number(value) }))}
                        placeholder="e.g., 1"
                        required
                    />
                    <Inputs
                        label={t('approvalDetail.step.name')}
                        value={formData.step_name}
                        onChange={(value) => setFormData((prev) => ({ ...prev, step_name: value }))}
                        placeholder="e.g., approval manager"
                        required
                    />
                    <Selects
                        label={t('approvalDetail.step.role')}
                        value={formData.step_role}
                        onChange={(value) => setFormData((prev) => ({ ...prev, step_role: value }))}
                        required
                        options={stepRole} />
                    {roleList && (
                        <Selects
                            label={t('approvalDetail.step.roleName')}
                            value={formData.role_id}
                            onChange={(value) => setFormData((prev) => ({ ...prev, role_id: value }))}
                            required
                            options={roleListToSelectOptions(roleList?.data)} />
                    )}
                    <Selects
                        label={t('approvalDetail.step.type')}
                        value={formData.type}
                        onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                        options={stepType} />
                    <Selects
                        label={t('approvalDetail.step.category')}
                        value={formData.category}
                        onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                        options={stepCategory} />
                    <Selects
                        label={t('approvalDetail.step.approvalWay')}
                        value={formData.approval_way}
                        onChange={(value) => setFormData((prev) => ({ ...prev, approval_way: value }))}
                        options={stepApprovalWay} />
                    <Inputs
                        label={t('approvalDetail.step.structure')}
                        value={formData.structure}
                        onChange={(value) => setFormData((prev) => ({ ...prev, structure: value }))}
                        placeholder="e.g., sender_manager"
                    />
                </section>

                <div className="flex flex-wrap gap-5 mt-4">
                    {toggles.map((item) => (
                        <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData[item.key]}
                                onChange={(e) => setFormData((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                                className="w-4 h-4 accent-blue-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                        </label>
                    ))}
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-2">
                    <Buttons
                        label={createFlowStep.isPending
                            ? t('approvalDetail.createStep.creating')
                            : t('approvalDetail.createStep.submit')}
                        disable={createFlowStep.isPending}
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    )
}
