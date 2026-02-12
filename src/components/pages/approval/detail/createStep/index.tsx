import { useNavigate, useParams } from "react-router-dom";
import Buttons from "../../../../atoms/buttons";
import Head from "../../../../molecules/head";
import { useCreateFlowStep } from "../../../../../hooks/mutation/approval/useCreateApprovalStep";
import { useState } from "react";
import { Inputs } from "../../../../molecules/input/inputs";
import { Selects } from "../../../../molecules/input/selects";
import { stepRole } from "../../../../../constans/approval";
import { useRoleList } from "../../../../../hooks/query/role/list";
import { roleListToSelectOptions } from "../../../../../utils/role";

export default function CreateStepApproval() {
    const navigate = useNavigate()

    const { id } = useParams()
    const createFlowStep = useCreateFlowStep()

    const { data: roleList } = useRoleList()

    const [formData, setFormData] = useState({
        step_order: 1,
        step_name: '',
        step_role: '',
        role_id: '',
        structure: '',
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

            // Static hardcoded values
            isRequired: true,
            is_visible: true,
            type: 'all',
            category: 'all',
            approval_way: 'web',
        }

        createFlowStep.mutate(payload, {
            onSuccess: () => {
                // Navigate back to flow detail page
                navigate(`/dashboard/approval/${id}`)
            },
        })
    }

    return (
        <div>
            <Head label="Create Step" className="mb-4" />

            <form onSubmit={handleSubmit}>
                <section className="flex gap-4 mt-4">
                    <div className="w-1/2 flex flex-col gap-4">
                        <Inputs
                            label="Step Order"
                            numberOnly
                            value={`${formData.step_order}`}
                            onChange={(value) => setFormData((prev) => ({ ...prev, step_order: Number(value) }))}
                            placeholder="e.g., 27"
                            required
                        />
                        <Inputs
                            label="Step Name"
                            value={formData.step_name}
                            onChange={(value) => setFormData((prev) => ({ ...prev, step_name: value }))}
                            placeholder="e.g., Approval"
                            required
                        />
                    </div>

                    <div className="w-1/2 flex flex-col gap-4">
                        <Selects
                            label="Step Role"
                            value={formData.step_role}
                            onChange={(value) => setFormData((prev) => ({ ...prev, step_role: value }))}
                            required
                            options={stepRole} />
                        {roleList && (
                            <Selects
                                label="Role ID"
                                value={formData.role_id}
                                onChange={(value) => setFormData((prev) => ({ ...prev, role_id: value }))}
                                required
                                options={roleListToSelectOptions(roleList?.data)} />
                        )}

                    </div>
                </section>

                <Inputs
                    label="Strukture"
                    containerClassName="mt-4"
                    value={formData.structure}
                    onChange={(value) => setFormData((prev) => ({ ...prev, structure: value }))}
                    placeholder="e.g., structure"
                    required
                />

                {/* Buttons */}
                <div className="mt-6 flex gap-2">
                    <Buttons
                        label={createFlowStep.isPending ? 'Creating...' : 'Create Approval Flow'}
                        disable={createFlowStep.isPending}
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    )
}
