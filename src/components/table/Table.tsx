import "./table.css"
import {flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import React, {useEffect} from "react";
import {TableProps} from "../../config/Config";


export function Table(props: TableProps) {
    const [data, _setData] = React.useState(() => [...props.data])
    const columns = props.columns
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
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell, index) => (
                            <td key={index}>
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