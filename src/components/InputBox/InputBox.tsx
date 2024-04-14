import {InputBoxProps} from "../../config/Config";
import "./input_box.css"

export default function InputBox(props: InputBoxProps) {
    return (
        <div className="input_box">
            <input type={props.type}  placeholder={props.placeholder} onChange={(e) => props.change(e.target.value)}/>
        </div>
    )
}