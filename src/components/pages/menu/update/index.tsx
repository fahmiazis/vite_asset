import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useMenuDetail } from '../../../../hooks/query/menu/detail'
import { useUpdateMenu } from '../../../../hooks/mutation/menu/useUpdateMenus'

export default function UpdateMenu() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: res, isLoading } = useMenuDetail(id || '')
    const detail = res?.data

    const [name, setName] = useState('')
    const [parentId, setParentId] = useState('')
    const [path, setPath] = useState('')
    const [routePath, setRoutePath] = useState('')
    const [iconName, setIconName] = useState('')
    const [status, setStatus] = useState('active')
    const [showIconTip, setShowIconTip] = useState(false)

    useEffect(() => {
        if (detail) {
            setName(detail.name ?? '')
            setParentId(detail.parent_id ?? '')
            setPath(detail.path ?? '')
            setIconName(detail.icon_name ?? '')
            setStatus(detail.status ?? 'active')
        }
    }, [detail])

    const { mutate, isPending } = useUpdateMenu(id || '')

    const handleUpdate = () => {
        mutate({
            name,
            parent_id: parentId || null,
            path,
            route_path: routePath,
            icon_name: iconName || null,
            status,
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading data...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h6 className='text-3xl font-bold'>Update Menu</h6>

            <section className='flex justify-between items-center gap-4 mt-4'>
                <Inputs label='Name' value={name} onChange={setName} containerClassName='w-1/2' />
                <Inputs label='Path' value={path} onChange={setPath} containerClassName='w-1/2' />
                <Inputs label='Route Path' value={routePath} onChange={setRoutePath} containerClassName='w-1/2' />
            </section>

            <section className='flex justify-between items-center gap-4 mt-4'>
                <Inputs label='Parent ID' value={parentId} onChange={setParentId} containerClassName='w-1/2' />
                <div className='w-1/2 relative'>
                    <Inputs
                        label='Icon Name'
                        value={iconName}
                        onChange={setIconName}
                        containerClassName='w-full'
                    />
                    <button
                        type="button"
                        onClick={() => setShowIconTip(prev => !prev)}
                        className="absolute right-0 top-0 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                        ? Icon help
                    </button>

                    {showIconTip && (
                        <div className="absolute mt-1.5 px-3 py-2 text-xs bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg text-gray-600 dark:text-gray-300">
                            Browse icon names at{" "}
                            <a
                                href="https://icon-sets.iconify.design"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                            >
                                Iconify — Home of open source icons
                            </a>
                            , copy the icon name and paste it here.
                        </div>
                    )}
                </div>

                {/* Status Toggle */}
                <div className='w-1/2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <button
                            type="button"
                            onClick={() => setStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${status === 'active' ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </section>

            <div className='flex items-center gap-2 mt-4'>
                <button
                    onClick={() => navigate(-1)}
                    className='px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300'
                >
                    Cancel
                </button>
                <Buttons
                    label={isPending ? 'Saving...' : 'Save Changes'}
                    onClick={handleUpdate}
                    disable={isPending}
                />
            </div>
        </div>
    )
}