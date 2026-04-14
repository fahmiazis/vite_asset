import { useAttachmentSettingList } from '../../../hooks/query/attachmentSetting/list'
import { AttachmentSettingTable } from '../../organisms/attachmentSetting/table'

export default function AttachmentSettingPage() {
    const { data } = useAttachmentSettingList("")
    return (
        <div>
            {data && (
                <AttachmentSettingTable data={data.data} />
            )}
        </div>
    )
}
