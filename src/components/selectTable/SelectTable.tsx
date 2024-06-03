import {SelectTableProps} from "../../config/Config";
import "./select_table.css"
import {useState} from "react";


export default function SelectTable(props: SelectTableProps) {
    const [selectedRow, setSelectedRow] = useState<number>(-1);
    const handleRowClick = (index:number) => {
        setSelectedRow(index);
        props.change(index);
    };
    return (
        <div className="select_box">
            <table>
                <thead>
                <tr>
                    <th>프리셋</th>
                    <th>VCPUS(개)</th>
                    <th>RAM(MB)</th>
                    <th>디스크 총계(GB)</th>
                </tr>
                </thead>
                <tbody>
                {props.rows.map((row, index) => (
                    <tr key={index} onClick={() => handleRowClick(index)}
                        className={selectedRow === index ? 'selected' : ''}>
                        <td>{row.name}</td>
                        <td>{row.cpu}</td>
                        <td>{row.ram}</td>
                        <td>{row.disk}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}