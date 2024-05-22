import {useLocation} from "react-router-dom";
import React, {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {DatePickProps, InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import PageHeader from "../../components/header/PageHeader";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";

export default function ContainerExtensionPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = state != undefined
    if(state != undefined) {
        setSelected(6)
    }
    const [containerName, setContainerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    
    const nameChange = (target:any) => {
        setContainerName(target.value)
    }
    const pwChange = (target:any) => {
        setPassword(target.value)
    }
    const containerNameInputBoxProps:InputBoxProps = {type:"text", placeholder:"컨테이너명을 입력하시오",
        value:containerName, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type: "password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}

    const [endDate, setEndDate] = useState<Date>(new Date());
    const endDateChange = (value: Date) => {setEndDate(value)}
    const endDatePickProps:DatePickProps = {date: endDate, change: endDateChange}
    //Button disable state
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)

    const url:string = SERVER_URL + "/db/container_extension"
    const extensionServer = async () => {
        const formData = new FormData()
        if(hasInfo) {
            formData.append('container_name', state.container_name);
        } else {
            formData.append('container_name', containerName);
        }
        formData.append('password', password);
        formData.append('end_date', endDate.toISOString().split("T")[0])
        fetch(url, {
            method: 'PUT',
            body: formData
        }).then(res => res).then(res => res.ok ? alert("연장 완료") : alert("연장 실패"))
            .catch((error) => {console.error('Error:', error)})
    }
    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsBtnDisabled(true)
        if(containerName === "" || password === "") {
            alert("모든 항목을 입력해주세요")
            return
        }
        extensionServer();
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("컨테이너명")}
            {hasInfo ? SubHead(state.container_name) : InputBox(containerNameInputBoxProps)}

            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}

            {SubHead("연장 기간")}
            {DatePick(endDatePickProps)}
            <button className="submit_button"
                    disabled={isBtnDisabled}
                    onClick={(e) => {
                        setIsBtnDisabled(true)
                        submit(e)
                    }}>
                {isBtnDisabled ? "연장 신청 중" : "연장 신청"}
            </button>
        </div>
    );
}