import "./table.css"
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import React from "react";

type TableData = {
    name: string
    ip: string
    rental_period: string
}
const defaultData: TableData[] = [
    {
        name: 'tanner',
        ip: '192.168....',
        rental_period: '2000.00.00 ~ 2000.00.00'
    },
    {
        name: 'tandy',
        ip: '192.168....',
        rental_period: '2000.00.00 ~ 2000.00.00'
    },
    {
        name: 'joe',
        ip: '192.168....',
        rental_period: '2000.00.00 ~ 2000.00.00',
    },
]

const columnHelper = createColumnHelper<TableData>()

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => '인스턴스 명'
    }),

    columnHelper.accessor('ip', {
        cell: info => <>{info.getValue()}</>,
        header: () => 'IP'
    }),
    columnHelper.accessor('rental_period', {
        header: () => '대여 기간',
        cell: info => info.renderValue()
    }),
]
export function Table() {
    const [data, _setData] = React.useState(() => [...defaultData])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="table_container">
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}