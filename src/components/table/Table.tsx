import "./table.css"
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import React, {useEffect} from "react";
import {TableData, TableProps} from "../../config/Config";

const columnHelper = createColumnHelper<TableData>()

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => '이름'
    }),
    columnHelper.accessor('server_name', {
        cell: info => info.getValue(),
        header: () => '인스턴스명'
    }),

    columnHelper.accessor('host_ip', {
        cell: info => <>{info.getValue()}</>,
        header: () => 'IP'
    }),
    columnHelper.accessor('rental_period', {
        header: () => '대여 기간',
        cell: info => info.renderValue()
    }),
]
export function Table(props: TableProps) {
    const [data, _setData] = React.useState(() => [...props.data])
    useEffect(() => {
        _setData([...props.data])
    }, [props.data]);

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