import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {
    DatePickProps,
    InputBoxProps,
    SelectTableItem,
    SelectTableProps,
    SERVER_URL,
    sidebarPanel, TableData
} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import SelectTable from "../../components/selectTable/SelectTable";
import Loading from "../../components/loading/Loading";


export default function RentalPage() {
    const {selected} = useContext(SidebarContext);
    const [name, setName] = useState<string>("")
    const [serverName, setServerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const nameChange = (value:string) => {
        setName(value)
    }
    const serverNameChange = (value:string) => {
        setServerName(value)
    }
    const pwChange = (value:string) => {
        setPassword(value)
    }
    const nameInputBoxProps: InputBoxProps = {type:"text", placeholder:"사용자명을 입력하시오",
        value:name, change: nameChange}
    const serverNameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:serverName, change: serverNameChange}
    const pwInputBoxProps:InputBoxProps = {type:"password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const startDateChange = (value: Date) => {setStartDate(value)}
    const endDateChange = (value: Date) => {setEndDate(value)}
    const startDatePickProps:DatePickProps = {date: startDate, change: startDateChange}
    const endDatePickProps:DatePickProps = {date: endDate, change: endDateChange}

    const [flavor, setFlavor] = useState<number>(0);
    const flavorChange = (value: number) => {setFlavor(value)}

    const flavorUrl = SERVER_URL + "/openstack/flavor_list";
    const [flavorLoading, setFlavorLoading] = useState<boolean>(true);
    const [flavorLoadError, setFlavorLoadError] = useState<boolean>(false);
    const [flavorData, setFlavorData] = useState<SelectTableItem[]>([])
    const makeTableData = (data:any) => {
        setFlavorData([]);
        data.map((item:any) => {
            setFlavorData((prev:SelectTableItem[]) => [...prev, {
                name: item.name,
                cpu: item.cpu,
                ram: item.ram,
                disk: item.disk
            }]);
        });
    };
    useEffect(() => {
        fetch(flavorUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((result) => {
            makeTableData(result);
            setFlavorLoading(false);
        }).catch((error) => {
            setFlavorLoadError(true);
        });
    }, []);
    //TODO 추가적으로, image_list라는 API 추가하여 이미지 이름들 받아올 수 있게 하였음
    //TODO 비밀번호를 설정할 것인지, 키페어를 이용할 것인지를 사용자가 선택할 수 있어야 함
    const selectTableProps: SelectTableProps = {rows:flavorData, change: flavorChange}
    const url:string = SERVER_URL + "/openstack/rental"
    //TODO 요청결과에 따른 반응 수정 필요
    //testData[flavor].name
    const rentalServer = async () => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user_name    : name,
                server_name  : serverName,
                start_date   : startDate.toISOString().split("T")[0],
                end_date     : endDate.toISOString().split("T")[0],
                image_name   : "cirros-0.6.2-x86_64-disk",
                flavor_name  : flavorData[flavor].name,
                network_name : "shared",
                password     : password,
                cloud_init   : ""
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res).then(res => res.ok ? alert("대여신청 완") : alert("대여신청 실"))
            .catch((error) => {console.error('Error:', error)})
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        rentalServer()
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("사용자명")}
            {InputBox(nameInputBoxProps)}
            {SubHead("인스턴스명")}
            {InputBox(serverNameInputBoxProps)}
            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}
            {SubHead("대여 기간")}
            {DatePick(startDatePickProps)}
            {DatePick(endDatePickProps)}
            {SubHead("OS 이미지")}
            <h5>cirros-0.6.2-x86_64-disk</h5>
            {SubHead("Flavor")}
            {SelectTable(selectTableProps)}
            {flavorLoadError ? SubHead("서버로부터 응답이 없습니다.") :
                flavorLoading ? <Loading/> : null}
            <button className="submit_button" onClick={(e) => {submit(e)}}>대여 신청</button>
        </div>
    );
}