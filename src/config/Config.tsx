interface ISidebar{
    name: string;
    path: string;
}
export const sidebarPanel:ISidebar[] = [{name: '서버 현황', path: '/'},
    {name: '서버 대여', path: '/rental'},
    {name: '서버 연장', path: '/extension'},
    {name: '서버 반납', path: '/return'}]

export interface InputBoxProps {
    type: string;
    value: string;
    placeholder: string;
    change: (value:any) => void;
}

export interface serverData {
    server_name: string;
    host_ip: string;
}

export interface TableData {
    name: string;
    server_name: string;
    host_ip: string;
    rental_period: string;
    server_data_extension: serverData;
    server_data_return: serverData;
}

export const SERVER_URL: string = "http://122.46.233.235:58080";

export interface TableProps {
    data: TableData[];
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

export interface ComboBoxProps {
    name: string;
    items: ComboBoxItem[];
    change: (value:string) => void;
}

export interface ComboBoxItem {
    value: string;
    label: string;
}