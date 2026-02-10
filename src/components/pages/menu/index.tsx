import React from 'react'
import { useMenuList } from '../../../hooks/query/menu/list'
import { MenuTable } from '../../organisms/menu'

export default function MasterMenu() {
    const { data, isLoading } = useMenuList()

    console.log('list all meuhere ==>', data)
    return (
        <>
            {isLoading ? (
                <p>sabar yee..</p>
            ) : data ? (
                <MenuTable data={data?.data} />
            ) : null}
        </>
    )
}
