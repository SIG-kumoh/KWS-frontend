import DatePicker from "react-datepicker";
import {DatePickProps} from "../../config/Config";
import 'react-datepicker/dist/react-datepicker.css';
import "./date_pick.css"



export default function DatePick(props: DatePickProps) {
    return (
        <div className="date_picker">
            <DatePicker
                className="date_picker_input"
                selected={props.date}
                onChange={props.change}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
            />
        </div>
    )
}