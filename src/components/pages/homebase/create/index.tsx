import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Selects } from "../../../molecules/input/selects"
import { useCreateHomeBase } from "../../../../hooks/mutation/homebase/create"
import { activeBranchListToSelectOptions } from "../../../../utils/branch"
import { useBranchList } from "../../../../hooks/query/branch/list"

const DUMMY_BRANCH_OPTIONS = [
    { id: "e9466ee0-2081-4560-a42c-57d45d0d026f", value: "e9466ee0-2081-4560-a42c-57d45d0d026f", label: "Bandung Barat" },
    { id: "b1234567-1234-1234-1234-123456789abc", value: "b1234567-1234-1234-1234-123456789abc", label: "Jakarta Pusat" },
    { id: "c9876543-9876-9876-9876-987654321def", value: "c9876543-9876-9876-9876-987654321def", label: "Surabaya Timur" },
    { id: "d1111111-2222-3333-4444-555555555555", value: "d1111111-2222-3333-4444-555555555555", label: "Medan Kota" },
]

export default function CreateHomeBasePage() {
    const navigate = useNavigate()
    const [branchId, setBranchId] = useState("")
    const [error, setError] = useState("")

    const { mutate, isPending } = useCreateHomeBase()
    const { data: branchList } = useBranchList()


    const handleSubmit = () => {
        if (!branchId) {
            setError("Branch is required")
            return
        }
        setError("")
        mutate({ branch_id: branchId })
    }

    return (
        <section className="space-y-5 mt-4">

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">
                        1
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Branch Information
                    </h3>
                </div>

                {branchList && (
                    <div className="max-w-md">
                        <Selects
                            label="Branch"
                            value={branchId}
                            onChange={(val) => {
                                setBranchId(val)
                                if (val) setError("")
                            }}
                            options={activeBranchListToSelectOptions(branchList?.data)}
                            placeholder="Select branch"
                            error={error}
                            labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            selectClassName="text-sm py-2"
                            required
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                    {isPending ? "Saving..." : "Set Home Base"}
                </button>
            </div>

        </section>
    )
}