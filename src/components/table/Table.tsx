import "./table.css"
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import React, {useEffect} from "react";
import {TableData, TableProps} from "../../config/Config";
import {useNavigate} from "react-router-dom";


export function Table(props: TableProps) {
    const [data, _setData] = React.useState(() => [...props.data])
    const columnHelper = createColumnHelper<TableData>()

    const navigate = useNavigate()
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
        columnHelper.accessor('server_data', {
            header: () => '연장',
            cell: info => <button onClick={() => navigate('/extension', {state: info.getValue()})}>연장</button>
        }),
        columnHelper.accessor('server_data', {
            header: () => '반납',
            cell: info => <button onClick={() => navigate('/return', {state: info.getValue()})}>반납</button>
        }),
    ]

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