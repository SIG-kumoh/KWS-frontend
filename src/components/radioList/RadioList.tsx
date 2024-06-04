import "./radio_list.css"
import { useState } from "react"

import { RadioListProps, RadioListItem } from "../../config/Config"

export default function RadioList(props: RadioListProps) {
    return (
        <div className="radio-list">
            {props.items.map((item, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="radio"
                            value={item.value}
                            name={props.name}
                            onClick={() => props.change(item.value)}
                        />
                        <span className={"radio-label"}>
                            {item.value}
                        </span>
                    </label>
                </div>
            ))}
        </div>
    )
}