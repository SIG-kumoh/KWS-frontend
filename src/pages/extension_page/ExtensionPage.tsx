import React, {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import PageHeader from "../../components/header/PageHeader";
import {DatePickProps, InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";

export default function ExtensionPage() {
    const {selected} = useContext(SidebarContext);
    const [serverName, setServerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [useKeyPair, setUseKeyPair] = useState<boolean>(false)
    const [keyFile, setKeyFile] = useState<File>(new File([], ''));
    const [ip, setIp] = useState<string>("")
    const nameChange = (value:string) => {
        setServerName(value)
    }
    const pwChange = (value:string) => {
        setPassword(value)
    }
    const ipChange = (value:string) => {
        setIp(value)
    }
    const handleFileChange = (event: any) => {
        setKeyFile(event.target.files[0]);
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


    // TODO
    const url:string = SERVER_URL + "/openstack/extension"
    const extensionServer = async () => {
        const formData = new FormData()
        formData.append('server_name', serverName);
        formData.append('host_ip', ip);
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
        extensionServer();
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {InputBox(serverNameInputBoxProps)}

            {SubHead("IP")}
            {InputBox(ipInputBoxProps)}

            {SubHead("비밀번호")}
            <input type="checkbox" onChange={({ target: { checked } }) => setUseKeyPair(checked)} />키 페어 방식 사용
            {InputBox(pwInputBoxProps)}

            {SubHead("연장 기간")}
            {DatePick(endDatePickProps)}
            <button className="submit_button" onClick={(e) => {submit(e)}}>연장 신청</button>
        </div>
    );
}