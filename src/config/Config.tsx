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
    change: (value:string) => void;
}

export interface DatePickProps {
    date: Date;
    change: (value:Date) => void;
}

export interface SelectTableProps {
    item: SelectTableItem[];
    change: (value:string) => void;
}

export interface SelectTableItem {
    value: string;
}
