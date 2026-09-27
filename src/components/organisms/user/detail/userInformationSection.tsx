import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import type { DetailuserState } from '../../../../models/users/detail';
import Buttons from '../../../atoms/buttons';
import { useUserAvatar } from '../../../../hooks/query/user/avatar';
import { useAvatarActions } from '../../../../hooks/mutation/user/useProfile';

interface userBaseProps {
    data?: DetailuserState
    className?: string
    /** true = halaman profil sendiri: tanpa tombol Update (khusus admin) */
    self?: boolean
}

const ACCEPT = 'image/jpeg,image/png,image/webp'
const MAX_SIZE = 2 * 1024 * 1024

const BaseUserInformation: React.FC<userBaseProps> = ({ data, className, self = false }: userBaseProps) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)

    const { url: avatarUrl, isLoading: loadingAvatar } = useUserAvatar(data?.id, data?.has_avatar)
    const { upload, remove } = useAvatarActions(data?.id ?? '', self)
    const busy = upload.isPending || remove.isPending

    const handleUpdate = () => {
        navigate(`/dashboard/user/${data?.id}/update`)
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        if (file.size > MAX_SIZE) return toast.error(t('userProfile.avatar.tooLarge'))
        upload.mutate(file)
    }

    const initials = (data?.fullname || data?.username || '?')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const formatDate = (value?: string) =>
        value ? new Date(value).toLocaleDateString(i18n.language) : '-'

    return (
        <div className={`${className} bg-white dark:bg-gray-950 rounded-3xl shadow-xl shadow-indigo-200/40 dark:shadow-none overflow-hidden border border-slate-100 dark:border-gray-700`}>
            <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 h-28" />

            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-6">
                {/* Foto + identitas */}
                <div className="sm:w-1/2 min-w-0">
                    <div className="-mt-16 relative w-32 h-32">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={data?.fullname}
                                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-950 shadow-xl object-cover bg-white"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-950 shadow-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-3xl font-bold">
                                {loadingAvatar ? '' : initials}
                            </div>
                        )}
                        {busy && (
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={handleFile} />
                    <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        <button
                            onClick={() => inputRef.current?.click()}
                            disabled={busy || !data}
                            className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2 disabled:opacity-50"
                        >
                            {t(data?.has_avatar ? 'userProfile.avatar.change' : 'userProfile.avatar.upload')}
                        </button>
                        {data?.has_avatar && (
                            <button
                                onClick={() => remove.mutate()}
                                disabled={busy}
                                className="text-red-500 hover:text-red-600 underline underline-offset-2 disabled:opacity-50"
                            >
                                {t('userProfile.avatar.remove')}
                            </button>
                        )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{t('userProfile.avatar.hint')}</p>

                    <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-gray-100 tracking-tight break-words">{data?.fullname}</h2>
                    <a href={`mailto:${data?.email}`} className="text-xs text-slate-500 dark:text-gray-400 hover:text-indigo-600 transition-colors duration-200 break-all">
                        {data?.email}
                    </a>
                    <div className='mt-4 flex flex-wrap gap-2'>
                        {data?.roles.map((role) => (
                            <span
                                key={role.id}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium capitalize"
                            >
                                {role.name}
                            </span>
                        ))}
                    </div>
                    {!self && (
                        <Buttons label={t('userProfile.edit')} className='rounded-2xl mt-4' onClick={handleUpdate} />
                    )}
                </div>

                {/* Detail */}
                <div className="sm:w-1/2 sm:pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label={t('userProfile.info.username')} value={data?.username || '-'} />
                        <InfoItem label={t('userProfile.info.status')} value={data?.status || '-'} highlight />
                        <InfoItem label={t('userProfile.info.nik')} value={data?.nik || '-'} />
                        <InfoItem label={t('userProfile.info.mpn')} value={data?.mpn_number || '-'} />
                        <InfoItem label={t('userProfile.info.createdAt')} value={formatDate(data?.created_at)} />
                        <InfoItem label={t('userProfile.info.updatedAt')} value={formatDate(data?.updated_at)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface InfoItemProps {
    label: string;
    value: string;
    highlight?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, highlight }) => {
    return (
        <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5">
                {label}
            </div>
            <div className={`text-xs font-semibold break-words ${highlight
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1.5 rounded-lg inline-block capitalize'
                : 'text-slate-700 dark:text-gray-200'
                }`}>
                {value}
            </div>
        </div>
    );
};

export default BaseUserInformation;
