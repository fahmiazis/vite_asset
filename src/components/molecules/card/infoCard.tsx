interface BasicCardProps {
    Label: string
    value?: string
    className?: string
}

export default function InfoCard({
    Label,
    value,
    className
}: BasicCardProps) {
    return (
        <section className={`${className}`}>
            <div className='flex flex-col rounded-xl p-2 px-4'>
                <h5 className="text-gray-500 text-sm">{Label}:</h5>
                <p className="capitalize text-lg font-semibold">{value}</p>
            </div>
        </section>
    )
}
