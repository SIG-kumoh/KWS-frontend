import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {SERVER_URL, sidebarPanel, TableData} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import {Table} from "../../components/table/Table";
import Loading from "../../components/loading/Loading";

export function OverViewPage() {
    const {selected} = useContext(SidebarContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [tableData, setTableData] = useState<TableData[]>([])
    const url = SERVER_URL + "/servers"
    const makeTableData = (data:any) => {
        data.map((item:any) => {
            setTableData((prev:TableData[]) => [...prev, {
                name: item.user_name,
                server_name: item.server_name,
                host_ip: item.floating_ip,
                rental_period: item.start_date + " ~ " + item.end_date
            }])
        })
    }
    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            makeTableData(result)
            setIsLoading(false)
        }).catch((error) => {
            setIsError(true)
        })
    })
    if(isError) {
        return (
            <div>
                {PageHeader(sidebarPanel[selected].name)}
                {SubHead("서버로부터 응답이 없습니다.")}
            </div>
        )
    } else if (isLoading) {
        return (
            <div>
                {PageHeader(sidebarPanel[selected].name)}
                <Loading/>
            </div>
    )
    } else {
        return(
            <div>
                {PageHeader(sidebarPanel[selected].name)}
                {SubHead("요약")}
                {SubHead("대여 현황")}
                {Table({data: tableData})}
            </div>
        )
    }
}