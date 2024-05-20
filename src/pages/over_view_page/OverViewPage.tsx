import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {PieChartProps, SERVER_URL, sidebarPanel, TableData} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import {Table} from "../../components/table/Table";
import Loading from "../../components/loading/Loading";
import PieChart from "../../components/pieChart/PieChart";

interface CharData {
    total_info: {
        limit: {
            vcpu: number,
            ram: number,
            disk: number
        },
        using: {
            count: number,
            vcpus: number,
            ram: number,
            disk: number
        },
        remaining: {
            vcpu: number,
            ram: number,
            disk: number
        }
    },
    node_resources: {
        name: string,
        limit: {
            vcpu: number,
            ram: number,
            disk: number
        },
        using: {
            count: number,
            vcpus: number,
            ram: number,
            disk: number
        },
        remaining: {
            vcpus: number,
            ram: number,
            disk: number
        }
    }[]
}

export function OverViewPage() {
    const {selected} = useContext(SidebarContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [chartData, setChartData] = useState<any>();
    const tableDataUrl = SERVER_URL + "/db/servers";
    const chartDataUrl = SERVER_URL + "/openstack/resources";

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
        fetch(chartDataUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            setChartData(makeChartData(result));
            setIsLoading(false);
        }).catch((error) => {
            setIsError(true);
        })
    }, []);

    return (
        <div className="overview_page">
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("요약")}
            {isError || chartData == null ? SubHead("서버로부터 응답이 없습니다.") :
                isLoading ? <Loading/> :
                    <>
                        <h4>[전체 리소스 사용량]</h4>
                        <div className={"summary_container"}>
                            {PieChart(makePieChartProp({
                                numbers: [chartData.total_info.remaining.vcpu, chartData.total_info.using.vcpus],
                                title: "vcpu",
                                total: chartData.total_info.limit.vcpu
                            }))}
                            {PieChart(makePieChartProp({
                                numbers: [chartData.total_info.remaining.ram, chartData.total_info.using.ram],
                                title: "ram",
                                total: chartData.total_info.limit.ram
                            }))}
                            {PieChart(makePieChartProp({
                                numbers: [chartData.total_info.remaining.disk, chartData.total_info.using.disk],
                                title: "disk",
                                total: chartData.total_info.limit.disk
                            }))}
                        </div>
                        <h4>[노드별 리소스 사용량]</h4>
                        {chartData.node_resources.map((item: any) => {
                            return (
                                <>
                                    <p>{item.name} 사용량</p>
                                    <div className={"summary_container"}>
                                        {PieChart(makePieChartProp({
                                            numbers: [item.remaining.vcpus, item.using.vcpus],
                                            title: "vcpu",
                                            total: item.limit.vcpu
                                        }))}
                                        {PieChart(makePieChartProp({
                                            numbers: [item.remaining.ram, item.using.ram],
                                            title: "ram",
                                            total: item.limit.ram
                                        }))}
                                        {PieChart(makePieChartProp({
                                            numbers: [item.remaining.disk, item.using.disk],
                                            title: "disk",
                                            total: item.limit.disk
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

function makeChartData(prop:any):CharData {
    return {
        total_info: {
            limit: {
                vcpu: prop.limit_resources.total_spec.vcpu,
                ram: prop.limit_resources.total_spec.ram,
                disk: prop.limit_resources.total_spec.disk
            },
            using: {
                count: prop.using_resources.total_resources.count,
                vcpus: prop.using_resources.total_resources.vcpus,
                ram: prop.using_resources.total_resources.ram,
                disk: prop.using_resources.total_resources.disk
            },
            remaining: {
                vcpu: prop.limit_resources.total_spec.vcpu - prop.using_resources.total_resources.vcpus,
                ram: prop.limit_resources.total_spec.ram - prop.using_resources.total_resources.ram,
                disk: prop.limit_resources.total_spec.disk - prop.using_resources.total_resources.disk
            }
        },
        node_resources: prop.limit_resources.nodes_spec.map((item:any, idx:number) => {
            return {
                name: item.name,
                limit: {
                    vcpu: item.vcpu,
                    ram: item.ram,
                    disk: item.disk
                },
                using: {
                    count: prop.using_resources.nodes_resources[idx].count,
                    vcpus: prop.using_resources.nodes_resources[idx].vcpus,
                    ram: prop.using_resources.nodes_resources[idx].ram,
                    disk: prop.using_resources.nodes_resources[idx].disk
                },
                remaining: {
                    vcpus: item.vcpu - prop.using_resources.nodes_resources[idx].vcpus,
                    ram: item.ram - prop.using_resources.nodes_resources[idx].ram,
                    disk: item.disk - prop.using_resources.nodes_resources[idx].disk
                }
            }
        })
    }
}