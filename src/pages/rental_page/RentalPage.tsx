import PageHeader from "../../components/header/PageHeader";
import {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {
    DatePickProps,
    InputBoxProps,
    SelectTableItem,
    SelectTableProps,
    SERVER_URL,
    sidebarPanel
} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import SelectTable from "../../components/selectTable/SelectTable";


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
    //TODO 서버에서 받아온 데이터로 구성하게 바꿔야함
    const testData: SelectTableItem[] = [
        {name:"ae", cpu:1, ram:1, disk:1},
        {name:"a123e", cpu:2, ram:3, disk:4},
        {name:"aeee", cpu:1165, ram:12, disk:1222},
        {name:"aaae", cpu:154, ram:51, disk:11}
    ]
    const selectTableProps: SelectTableProps = {rows:testData, change: flavorChange}
    const url:string = SERVER_URL + "/rental"
    //TODO body image, network 추후에 논의해야함, 요청결과에 따른 반응 수정 필요
    const rentalServer = async () => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user_name   : name,
                server_name : serverName,
                start_date  : startDate,
                end_date    : endDate,
                image       : "ubuntu",
                flavor      : testData[flavor].name,
                network     : "private",
                password    : password
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
            <h5>Ubuntu</h5>
            {SubHead("Flavor")}
            {SelectTable(selectTableProps)}
            <button className="submit_button" onClick={(e) => {submit(e)}}>대여 신청</button>
        </div>
    );
}