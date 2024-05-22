import "./combo_box.css"
import {ComboBoxProps} from "../../config/Config"

export default function ComboBox(props: ComboBoxProps) {
    return (
        <div className="dropdown">
            <select name={props.name} className="dropdown_list" onChange={(e) => props.change(e.target.value)}>
                {props.items.map((item, index) => (
                    <option key={index} value={item.value} >{item.label}</option>
                ))}
            </select>
        </div>
    )
}
