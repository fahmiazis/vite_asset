import { useParams } from 'react-router-dom'
import { useMutationDetail } from '../../../../hooks/query/mutation/detail'

export default function DetailMutationPage() {
    const { "*": id } = useParams()
    const { data } = useMutationDetail(id || '')
  return (
    <div>
      detail mutation
    </div>
  )
}
