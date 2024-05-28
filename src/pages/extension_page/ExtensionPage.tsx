import React, {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import PageHeader from "../../components/header/PageHeader";
import {DatePickProps, InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import {useLocation} from "react-router-dom";

export default function ExtensionPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = (state != undefined)
    if(hasInfo) {
        setSelected(2)
    }
    const [serverName, setServerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [useKeyPair, setUseKeyPair] = useState<boolean>(false)
    const [keyFile, setKeyFile] = useState<File>(new File([], ''));
    const [ip, setIp] = useState<string>("")
    const nameChange = (target:any) => {
        setServerName(target.value)
    }
    const pwChange = (target:any) => {
        setPassword(target.value)
    }
    const ipChange = (target:any) => {
        setIp(target.value)
    }
    const handleFileChange = (target: any) => {
        setKeyFile(target.files[0]);
    }
    const serverNameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:serverName, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type: useKeyPair ? "file" : "password", placeholder:"비밀번호를 입력하시오",
        value:password, change: useKeyPair ? handleFileChange : pwChange}
    const ipInputBoxProps:InputBoxProps = {type:"text", placeholder:"IP를 입력하시오",
        value:ip, change: ipChange}


    const [endDate, setEndDate] = useState<Date>(new Date());
    const endDateChange = (value: Date) => {setEndDate(value)}
    const endDatePickProps:DatePickProps = {date: endDate, change: endDateChange}
    //Button disable state
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)

    const url:string = SERVER_URL + "/server/extension"
    const extensionServer = async () => {
        const formData = new FormData()
        if(hasInfo) {
            formData.append('server_name', state.server_name);
            formData.append('host_ip', state.host_ip);
        } else {
            formData.append('server_name', serverName);
            formData.append('host_ip', ip);
        }
        formData.append('password', (useKeyPair ? '' : password));
        formData.append('end_date', endDate.toISOString().split("T")[0])
        if (useKeyPair) formData.append('key_file', keyFile);
        fetch(url, {
            method: 'PUT',
            body: formData
        }).then(res => res).then(res => res.ok ? alert("연장 완료") : alert("연장 실패"))
            .catch((error) => {console.error('Error:', error)})
    }
    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsBtnDisabled(true)
        if(serverName === "" || (password === "" && useKeyPair) || ip === "") {
            alert("모든 항목을 입력해주세요")
            return
        }
        extensionServer();
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {hasInfo ? SubHead(state.server_name) : InputBox(serverNameInputBoxProps)}

            {SubHead("IP")}
            {hasInfo ? SubHead(state.host_ip) : InputBox(ipInputBoxProps)}

            {SubHead("비밀번호")}
            <input type="checkbox" onChange={({ target: { checked } }) => setUseKeyPair(checked)} />키 페어 방식 사용
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