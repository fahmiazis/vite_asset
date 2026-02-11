import { ArrowLeft01Icon } from 'hugeicons-react'
import { useNavigate } from 'react-router-dom'

interface HeadState {
    label?: string,
    className?: string
}

export default function Head({
    label = 'Kembali',
    className
}: HeadState) {
    const navigate = useNavigate()
    return (
        <div className={`flex gap-2 items-center ${className}`}>
            <ArrowLeft01Icon className='cursor-pointer' onClick={() => navigate(-1)}/>
            <p className='capitalize text-2xl'>{label}</p>
        </div>
    )
}
