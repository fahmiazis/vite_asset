import React from 'react'
import { useMenuList } from '../../../hooks/query/menu/list'
import { MenuTable } from '../../organisms/menu'
import Head from '../../molecules/head'

export default function MasterMenu() {
    const { data, isLoading } = useMenuList()

    console.log('list all meuhere ==>', data)
    return (
        <>
            <Head label='Menu' className='mb-4' />
            {isLoading ? (
                <p>sabar yee..</p>
            ) : data ? (
                <MenuTable data={data?.data} />
            ) : null}
        </>
    )
}
