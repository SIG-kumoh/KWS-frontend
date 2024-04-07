import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import {useContext} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {sidebarPanel} from "../../config/Config";

export function OverViewPage() {
    const {selected} = useContext(SidebarContext);
    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
        </div>
    );
}