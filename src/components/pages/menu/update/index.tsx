import { useMenuDetail } from '../../../../hooks/query/menu/detail'
import Head from '../../../molecules/head'
import { useNavigate, useParams } from 'react-router-dom'
import { Inputs } from '../../../molecules/input/inputs'
import { useUpdateMenu } from '../../../../hooks/mutation/menu/useUpdateMenus'
import type { UpdateMenuPayload } from '../../../../models/menu/update'
import { useState } from 'react'
import Buttons from '../../../atoms/buttons'

export default function UpdateMenuPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: menuDetail } = useMenuDetail(id || '')
    const { mutate, isPending } = useUpdateMenu()

    const [form, setForm] = useState<UpdateMenuPayload>({})
    const [error, setError] = useState<string | null>(null)
    const handleUpdate = () => {
        mutate({
            menuId: id || '',
            payload: {
                icon_name: form.icon_name,
            },
        },
            {
                onSuccess: () => {
                    navigate(`/dashboard/menu/${id}`)
                },
            })
    }

    return (
        <section className="bg-white rounded-xl p-4">
            <Head label={`Update Menu ${menuDetail?.data.name || ''}`} />

            <div className="grid grid-cols-3 gap-4 mt-6">
                <Inputs
                    label="Menu Name"
                    value={form.name || ''}
                    onChange={(val) =>
                        setForm((prev) => ({ ...prev, name: val }))
                    }
                />

                <Inputs
                    label="Path"
                    value={form.path || ''}
                    onChange={(val) =>
                        setForm((prev) => ({ ...prev, path: val }))
                    }
                />

                <Inputs
                    label="Icon Name"
                    value={form.icon_name || ''}
                    onChange={(val) =>
                        setForm((prev) => ({ ...prev, icon_name: val }))
                    }
                />

                <Inputs
                    label="Status"
                    value={form.status || ''}
                    onChange={(val) =>
                        setForm((prev) => ({
                            ...prev,
                            status: val as 'active' | 'inactive',
                        }))
                    }
                    helperText="active / inactive"
                />
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end mt-6">
                <Buttons
                    onClick={handleUpdate}
                    label={isPending ? 'Updating...' : 'Update Menu'}
                    disable={isPending}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                />

            </div>
        </section>
    )

}
