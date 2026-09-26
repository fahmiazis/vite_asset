import { useTranslation } from 'react-i18next'

/** Logo + nama aplikasi di kepala sidebar (desktop & mobile), logo sama dengan halaman login */
export default function SidebarBrand({ className = '' }: { className?: string }) {
    const { t } = useTranslation()

    return (
        <div className={`flex flex-col items-center gap-2 text-center ${className}`}>
            <img src="/images/logos.png" alt="Logo" className="h-14 w-auto object-contain" />
            <h2 className="text-base font-bold leading-tight">{t('app.name')}</h2>
        </div>
    )
}
