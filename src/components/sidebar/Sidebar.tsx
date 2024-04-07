import './sidebar.css'
import React, {useContext} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {sidebarPanel} from "../../config/Config";
import {Link} from "react-router-dom";

export default function Sidebar() {
    const {selected, setSelected} = useContext(SidebarContext);
    return (
        <div className="sidebar">
            <ul className="sidebar_menu">
                {sidebarPanel.map((panel, index) => (
                    <li key={index} className={`sidebar_panel ${selected === index ? 'selected' : ''}`}>
                        <Link to={panel.path} onClick={() => setSelected(index)}>{panel.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}