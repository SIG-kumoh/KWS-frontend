import "./over_view_page.css"
import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {
    PieChartProps,
    SERVER_URL,
    ServerTableData,
    TableProps,
    ContainerTableData
} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import {Table} from "../../components/table/Table";
import Loading from "../../components/loading/Loading";
import PieChart from "../../components/pieChart/PieChart";
import {createColumnHelper} from "@tanstack/react-table";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {SidebarContext} from "../../context/SidebarContext";
import Help from "../../components/svg/Help";

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
    const {selected, setSelected} = useContext(SidebarContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [serverData, setServerData] = useState<ServerTableData[]>([]);
    const [containerData, setContainerData] = useState<ContainerTableData[]>([]);
    const [chartData, setChartData] = useState<any>(null);
    const serverTableDataUrl = SERVER_URL + "/server/list";
    const chartDataUrl = SERVER_URL + "/node/resources";
    const containerTableDataUrl = SERVER_URL + "/container/list";
    const [colorList, setColorList] = useState<string[]>([]);

    const makeTableData = (data:any) => {
        setServerData([]);
        data.map((item:any) => {
            setServerData((prev:ServerTableData[]) => [...prev, {
                name: item.user_name,
                server_name: item.server_name,
                floating_ip: item.floating_ip,
                rental_period: item.start_date.split("T")[0] + " ~ " + item.end_date.split("T")[0],
                server_data_extension: {server_name: item.server_name, host_ip: item.floating_ip},
                server_data_return: {server_name: item.server_name, host_ip: item.floating_ip},
                network_name: item.network_name,
                node_name: item.node_name,
                flavor_name: item.flavor_name,
                image_name: item.image_name
            }]);
        });
    };
    const makeContainerData = (data:any) => {
        setContainerData([]);
        data.map((item:any) => {
            setContainerData((prev:ContainerTableData[]) => [...prev, {
                name: item.user_name,
                container_name: item.container_name,
                ip: item.ip,
                rental_period: item.start_date.split("T")[0] + " ~ " + item.end_date.split("T")[0],
                container_data_extension: item.container_name,
                container_data_return: item.container_name,
                network_name: item.network_name,
                node_name: item.node_name,
                port: item.port,
                image_name: item.image_name
            }]);
        });
    }

    const makeColorList = (length:number) => {
        let list = []
        for(let i=0; i<length; i++){
            list.push(getRGB(i*121212))
        }
        setColorList(list)
    }

    useEffect(() => {
        setSelected(0)
        fetch(serverTableDataUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            makeTableData(result);
        }).catch((error) => {
        });
        fetch(chartDataUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            makeColorList(result.limit_resources.nodes_spec.length+1)
            setChartData(makeChartData(result));
            setIsLoading(false);
        }).catch((error) => {
            setIsError(true);
        })
        fetch(containerTableDataUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            makeContainerData(result);
        }).catch((error) => {
        });
    }, []);
    return (
        <div className="overview_page">
            {PageHeader('시스템 현황')}
            <div className="inner_content">
                <div className="overview_title">
                    {SubHead("요약")}
                    <span className="title_svg_container"
                          data-tooltip-text="CPU 정보: Intel Core I7 6700 3.4GHz"
                    >
                    <Help/>
                </span>
                </div>

                {isError ? SubHead("서버로부터 응답이 없습니다.") :
                    isLoading ? <Loading/> :
                        <>
                            <h4>[전체 리소스 사용량]</h4>
                            <div className="summary_container">
                                {PieChart(makePieChartProp({
                                    numbers: [chartData.total_info.remaining.vcpu, chartData.total_info.using.vcpus],
                                    title: "vcpu",
                                    total: chartData.total_info.limit.vcpu,
                                    color: colorList[0]
                                }))}
                                {PieChart(makePieChartProp({
                                    numbers: [chartData.total_info.remaining.ram, chartData.total_info.using.ram],
                                    title: "ram",
                                    total: chartData.total_info.limit.ram,
                                    color: colorList[0]
                                }))}
                                {PieChart(makePieChartProp({
                                    numbers: [chartData.total_info.remaining.disk, chartData.total_info.using.disk],
                                    title: "disk",
                                    total: chartData.total_info.limit.disk,
                                    color: colorList[0]
                                }))}
                            </div>
                            <h4>[노드별 리소스 사용량]</h4>
                            {chartData.node_resources.map((item: any, idx: number) => {
                                return (
                                    <div key={idx}>
                                        <p>{item.name} 사용량</p>
                                        <div className={"summary_container"}>
                                            {PieChart(makePieChartProp({
                                                numbers: [item.remaining.vcpus, item.using.vcpus],
                                                title: "vcpu",
                                                total: item.limit.vcpu,
                                                color: colorList[idx + 1]
                                            }))}
                                            {PieChart(makePieChartProp({
                                                numbers: [item.remaining.ram, item.using.ram],
                                                title: "ram",
                                                total: item.limit.ram,
                                                color: colorList[idx + 1]
                                            }))}
                                            {PieChart(makePieChartProp({
                                                numbers: [item.remaining.disk, item.using.disk],
                                                title: "disk",
                                                total: item.limit.disk,
                                                color: colorList[idx + 1]
                                            }))}
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                }
                {SubHead("서버 대여 현황")}
                {Table(getServerTableProp(serverData, navigate))}
                {SubHead("컨테이너 대여 현황")}
                {Table(getContainerTableProp(containerData, navigate))}
            </div>
        </div>
    )
}

interface IProp {
    title: string;
    numbers: number[];
    total: number;
    color: string;
}

function makePieChartProp(prop: IProp): PieChartProps {
    const labels = ["non-use", "use"];
    const data = prop.numbers;
    return {labels: labels, data: data, title: prop.title, total: prop.total, unit: getUnit(prop.title), color: prop.color};
}

function getUnit(title:string): string{
    if(title === "vcpu") return "개";
    if(title === "ram") return "MB";
    if(title === "disk") return "GB";
    return "";
}

function getRGB(base:number) {
    const r = Math.floor(Math.sin(base) * 127 + 128);
    const g = Math.floor(Math.sin(base + 2) * 127 + 128);
    const b = Math.floor(Math.sin(base + 4) * 127 + 128);
    return `rgb(${r}, ${g}, ${b})`;
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

function getServerTableProp(data:ServerTableData[], navigate:NavigateFunction): TableProps {
    const columnHelper = createColumnHelper<ServerTableData>()
    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => '사용자'
        }),
        columnHelper.accessor('server_name', {
            cell: info => info.getValue(),
            header: () => '인스턴스명'
        }),
        columnHelper.accessor('floating_ip', {
            cell: info => info.getValue(),
            header: () => 'IP'
        }),
        columnHelper.accessor('rental_period', {
            header: () => '대여 기간',
            cell: info => info.getValue()
        }),
        //복사 https 문제때문에 주석처리
        /*columnHelper.accessor('server_data', {
            header: () => '복사',
            cell: info => <button onClick={() => handleCopyClipBoard(`${info.getValue().server_name}@${info.getValue().host_ip}`)}>복사</button>
        }),*/
        columnHelper.accessor('network_name', {
            cell: info => info.getValue(),
            header: () => '네트워크'
        }),
        columnHelper.accessor('node_name', {
            cell: info => info.getValue(),
            header: () => '노드'
        }),
        columnHelper.accessor('flavor_name', {
            cell: info => info.getValue(),
            header: () => '플레이버'
        }),
        columnHelper.accessor('image_name', {
            cell: info => info.getValue(),
            header: () => '이미지'
        }),
        columnHelper.accessor('server_data_extension', {
            header: () => '연장',
            cell: info => <button onClick={() => navigate('/server/extension', {state: info.getValue()})}>연장</button>
        }),
        columnHelper.accessor('server_data_return', {
            header: () => '반납',
            cell: info => <button onClick={() => navigate('/server/return', {state: info.getValue()})}>반납</button>
        }),
    ]
    return {
        data: data,
        columns: columns,
        columnHelper: columnHelper
    }
}

function getContainerTableProp(data:ContainerTableData[], navigate:NavigateFunction): TableProps {
    const columnHelper = createColumnHelper<ContainerTableData>()
    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => '사용자'
        }),
        columnHelper.accessor('container_name', {
            cell: info => info.getValue(),
            header: () => '컨테이너명'
        }),
        columnHelper.accessor('ip', {
            cell: info => info.getValue(),
            header: () => 'IP'
        }),
        columnHelper.accessor('rental_period', {
            header: () => '대여 기간',
            cell: info => info.getValue()
        }),
        //복사 https 문제때문에 주석처리
        /*columnHelper.accessor('server_data', {
            header: () => '복사',
            cell: info => <button onClick={() => handleCopyClipBoard(`${info.getValue().server_name}@${info.getValue().host_ip}`)}>복사</button>
        }),*/
        columnHelper.accessor('network_name', {
            cell: info => info.getValue(),
            header: () => '네트워크'
        }),
        columnHelper.accessor('image_name', {
            cell: info => info.getValue(),
            header: () => '이미지'
        }),
        columnHelper.accessor('node_name', {
            cell: info => info.getValue(),
            header: () => '노드'
        }),
        columnHelper.accessor('port', {
            cell: info => info.getValue(),
            header: () => '포트'
        }),
        columnHelper.accessor('container_data_extension', {
            header: () => '연장',
            cell: info => <button onClick={() => navigate('/container/extension', {state: info.getValue()})}>연장</button>
        }),
        columnHelper.accessor('container_data_return', {
            header: () => '반납',
            cell: info => <button onClick={() => navigate('/container/return', {state: info.getValue()})}>반납</button>
        }),
    ]
    return {
        data: data,
        columns: columns,
        columnHelper: columnHelper
    }
}