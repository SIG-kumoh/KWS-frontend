import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import {useContext} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import {Table} from "../../components/table/Table";

export function OverViewPage() {
    const {selected} = useContext(SidebarContext);
    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("요약")}
            {SubHead("대여 현황")}
            <Table/>
        </div>
    );
}