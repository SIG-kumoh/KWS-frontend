import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {PieChartProps, SERVER_URL, sidebarPanel, TableData} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import {Table} from "../../components/table/Table";
import Loading from "../../components/loading/Loading";
import PieChart from "../../components/pieChart/PieChart";
import * as readline from "readline";

//TODO 아래 데이터들을 SERVER_URL + /db/nodes_spec 에서 받아오도록 수정
const totalLimitResourcesData = {
    vcpu: 12,
    ram: 12.0,
    disk: 160
}

const nodeLimitResourcesData = {
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
        //console.log(chartData)
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
            {isError || chartData == null ? SubHead("서버로부터 응답이 없습니다.") :
                isLoading ? <Loading/> :
                    <>
                        <p>[전체 리소스 사용량]</p>
                        <div className={"summary_container"}>
                            {PieChart(makePieChartProp({
                                numbers: [totalLimitResourcesData.vcpu, chartData.total_resources.vcpus],
                                title: "vcpu",
                                total: totalLimitResourcesData.vcpu
                            }))}
                            {PieChart(makePieChartProp({
                                numbers: [totalLimitResourcesData.ram, chartData.total_resources.ram],
                                title: "ram",
                                total: totalLimitResourcesData.ram
                            }))}
                            {PieChart(makePieChartProp({
                                numbers: [totalLimitResourcesData.disk, chartData.total_resources.disk],
                                title: "disk",
                                total: totalLimitResourcesData.disk
                            }))}
                        </div>
                        <p>[노드별 리소스 사용량]</p>
                        {chartData.nodes_resources.map((item: any) => {
                            return (
                                <>
                                    <p>{item.name} 사용량</p>
                                    <div className={"summary_container"}>
                                        {PieChart(makePieChartProp({
                                            numbers: [nodeLimitResourcesData.vcpu, item.vcpus],
                                            title: "vcpu",
                                            total: nodeLimitResourcesData.vcpu
                                        }))}
                                        {PieChart(makePieChartProp({
                                            numbers: [nodeLimitResourcesData.ram, item.ram],
                                            title: "ram",
                                            total: nodeLimitResourcesData.ram
                                        }))}
                                        {PieChart(makePieChartProp({
                                            numbers: [nodeLimitResourcesData.disk, item.disk],
                                            title: "disk",
                                            total: nodeLimitResourcesData.disk
                                        }))}
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

function makePieChartProp(prop: IProp) : PieChartProps {
    const labels = ["non-use", "use"];
    const data = prop.numbers;
    return {labels: labels, data: data, title: prop.title, total: prop.total};
}