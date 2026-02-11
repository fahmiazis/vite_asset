import React from 'react';
import type { DetailuserState } from '../../../../models/users/detail';
import Images from '../../../atoms/images';
import Buttons from '../../../atoms/buttons';
import { useNavigate } from 'react-router-dom';

interface userBaseProps {
    data?: DetailuserState
    className?: string
}

const BaseUserInformation: React.FC<userBaseProps> = ({ data, className }: userBaseProps) => {
    const navigate = useNavigate()
    const handleUpdate = () => {
        navigate(`/dashboard/user/${data?.id}/update`)
    }
    return (
        <div className={`${className} bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden border border-slate-100 hover:shadow-indigo-300/60 transition-all duration-500 hover:scale-[1.02]`}>
            <div className="relative z-50 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 h-32 overflow-hidden"></div>

            {/* Profile Info Section */}
            <div className="px-8 pt-20 pb-6 flex justify-between gap-4 z-10">
                <div className='w-1/2'>
                    <Images
                        src={'https://i.pinimg.com/1200x/33/97/40/339740233b75f69ad32470be29570e3d.jpg'}
                        alt={data?.fullname}
                        className="-mt-40 absolute w-44 h-44 rounded-full z-50 border-4 border-white shadow-xl object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <h2 className="pt-10 text-3xl font-bold text-slate-800 mb-1 tracking-tight">{data?.fullname}</h2>
                    <a href={`mailto:${data?.email}`} className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                        {data?.email}
                    </a>
                    <div className='mt-8'>
                    <Buttons label='Update' onClick={handleUpdate}/>
                    </div>
                </div>

                <div className='w-1/2'>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="Gender" value={data?.username || '-'} />
                        <InfoItem label="Birthday" value={data?.username || ''} />
                        <InfoItem label="City" value={data?.status || ''} />
                        <InfoItem label="Gender" value={data?.username || '-'} />
                        <InfoItem label="Birthday" value={data?.username || ''} />
                        <InfoItem label="City" value={data?.status || ''} />
                    </div>
                </div>

                {/* Send Message Button */}
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
        <div className="group">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 group-hover:text-indigo-500 transition-colors duration-200">
                {label}
            </div>
            <div className={`text-sm font-semibold ${highlight
                ? 'text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block'
                : 'text-slate-700'
                } group-hover:translate-x-0.5 transition-transform duration-200`}>
                {value}
            </div>
        </div>
    );
};

export default BaseUserInformation;