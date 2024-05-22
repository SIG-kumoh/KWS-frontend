interface ISidebar{
    name: string;
    path: string;
}
export const sidebarPanel:ISidebar[] = [{name: '메인 화면', path: '/'},
    {name: '서버 대여', path: '/server/rental'},
    {name: '서버 연장', path: '/server/extension'},
    {name: '서버 반납', path: '/server/return'},
    {name: '컨테이너 대여', path: '/container/rental'},
    {name: '컨테이너 연장', path: '/container/extension'},
    {name: '컨테이너 반납', path: '/container/return'},
];

export interface InputBoxProps {
    type: string;
    value: string;
    placeholder: string;
    change: (value:any) => void;
}

export interface ServerData {
    server_name: string;
    host_ip: string;
}

export interface ServerTableData {
    name: string;
    server_name: string;
    floating_ip: string;
    rental_period: string;
    server_data_extension: ServerData;
    server_data_return: ServerData;
    network_name: string;
    node_name: string;
    flavor_name: string;
    image_name: string;
}

export interface ContainerTableData {
    name: string;
    container_name: string;
    ip: string;
    rental_period: string;
    image_name: string;
    port: string;
    network_name: string;
    node_name: string;
    container_data_extension: string;
    container_data_return: string;
}

export const SERVER_URL: string = "http://122.46.233.235:58080";

export interface TableProps {
    data: any[];
    columns: any[];
    columnHelper: any;
}
export interface DatePickProps {
    date: Date;
    change: (value:Date) => void;
}

export interface SelectTableProps {
    rows: SelectTableItem[];
    change: (value:number) => void;
}

export interface SelectTableItem {
    name: string;
    cpu: number;
    ram: number;
    disk: number;
}

export interface RadioListProps {
    name: string;
    items: RadioListItem[];
    change: (value:string) => void;
}

export interface RadioListItem {
    value: string;
}

export interface PieChartProps {
    data: number[];
    labels: string[];
    title: string;
    total: number;
}