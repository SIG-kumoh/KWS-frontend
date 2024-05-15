import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {SERVER_URL, sidebarPanel, TableData} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import {Table} from "../../components/table/Table";
import Loading from "../../components/loading/Loading";
import PieChart from "../../components/pieChart/PieChart";

const nodeData = {
    vcpu: 6,
    ram: 6.0,
    disk: 80
}

export function OverViewPage() {
    const {selected} = useContext(SidebarContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [tableData, setTableData] = useState<TableData[]>([])
    const [chartData, setChartData] = useState<any>(null)
    const tableDataUrl = SERVER_URL + "/db/servers";
    let usesvcpu = 0;
    let usesram = 0;
    let usesdisk = 0;

    const makeTableData = (data:any) => {
        setTableData([]);
        data.map((item:any) => {
            setTableData((prev:TableData[]) => [...prev, {
                name: item.user_name,
                server_name: item.server_name,
                host_ip: item.floating_ip,
                rental_period: item.start_date.split("T")[0] + " ~ " + item.end_date.split("T")[0],
                server_data: {server_name: item.server_name, host_ip: item.floating_ip}
            }]);
        });
    };

    useEffect(() => {
        fetch(tableDataUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            makeTableData(result);
            setIsLoading(false);
        }).catch((error) => {
            setIsError(true);
        });
        fetch(SERVER_URL + "/openstack/resources", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            setChartData(result);
            setIsLoading(false);
            getUses()
        }).catch((error) => {
            setIsError(true);
        })
    }, []);

    function getUses() {
        if(chartData === null) return;
        chartData.nodes_resources.map((item:any) => {
            usesvcpu += item.vcpus;
            usesram += item.ram;
            usesdisk += item.disk;
        });
    }

    return (
        <div className="overview_page">
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("요약")}
            {isError ? SubHead("서버로부터 응답이 없습니다.") :
                isLoading ? <Loading/> :
                    <>
                        <p>Total Compute</p>
                        <div className={"summary_container"}>
                            {PieChart(makePieChartProp({numbers: [chartData.total_resources.ram-usesram, usesram], title: "ram", total: chartData.total_resources.ram}))}
                            {PieChart(makePieChartProp({numbers: [chartData.total_resources.vcpus-usesvcpu, usesvcpu], title: "vcpu", total: chartData.total_resources.vcpus}))}
                            {PieChart(makePieChartProp({numbers: [chartData.total_resources.disk-usesdisk, usesdisk], title: "disk", total: chartData.total_resources.disk}))}
                        </div>
                        {chartData.nodes_resources.map((item:any) => {
                            return (
                                <>
                                    <p>{item.name}</p>
                                    <div className={"summary_container"}>
                                        {PieChart(makePieChartProp({numbers: [nodeData.ram, item.ram], title: "ram", total: nodeData.ram}))}
                                        {PieChart(makePieChartProp({numbers: [nodeData.vcpu, item.vcpus], title: "vcpu", total: nodeData.vcpu}))}
                                        {PieChart(makePieChartProp({numbers: [nodeData.disk, item.disk], title: "disk", total: nodeData.disk}))}
                                    </div>
                                </>
                            )
                        })}
                    </>
            }
            {!(isError || isLoading) ? SubHead("대여 현황") : null}
            {Table({data: tableData})}
        </div>
    )
}

interface IProp {
    title: string;
    numbers: number[];
    total: number;
}

function makePieChartProp(prop: IProp) :PieChartProps {
    const labels = ["non-use", "use"];
    const data = prop.numbers;
    return {labels: labels, data: data, title: prop.title, total: prop.total};
}