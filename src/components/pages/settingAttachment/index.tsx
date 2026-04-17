import { useAttachmentSettingList } from '../../../hooks/query/attachmentSetting/list'
import Head from '../../molecules/head'
import { AttachmentSettingTable } from '../../organisms/attachmentSetting/table'

export default function AttachmentSettingPage() {
    const { data } = useAttachmentSettingList("")
    return (
        <div>
            <Head label='Setting Attachment' className='mb-4'/>
            {data && (
                <AttachmentSettingTable data={data.data} />
            )}
        </div>
    )
}
