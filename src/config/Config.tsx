interface ISidebar{
    name: string;
    path: string;
}
export const sidebarPanel:ISidebar[] = [{name: '서버 현황', path: '/'},
    {name: '서버 대여', path: '/rental'},
    {name: '서버 연장', path: '/extension'},
    {name: '서버 반납', path: '/return'}]