import Head from '../../../molecules/head'
import CreateDepreciationPage from '../../../organisms/depreciation/create'

export default function CreateDepre() {
    return (
        <section className='py-2'>
            <Head label='Create Depreciation' className='mb-2' />
            <CreateDepreciationPage />
        </section>
    )
}
