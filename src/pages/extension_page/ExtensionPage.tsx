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


    const serverNameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:serverName, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type: "password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}
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
        }).then(res => res).then(res => res.ok ? alert("연장신청 완") : alert("연장신청 실"))
            .catch((error) => {console.error('Error:', error)})
    }
    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        extensionServer();
    }


    // TODO keyPair 사용 - 나중에 지울거임
    const [useKeyPair, setUseKeyPair] = useState<boolean>(false)
    const [keyFile, setKeyFile] = useState<File>(new File([], ''));
    const handleFileChange = (event: any) => {
        setKeyFile(event.target.files[0]);
    };

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {InputBox(serverNameInputBoxProps)}

            {SubHead("IP")}
            {InputBox(ipInputBoxProps)}

            {SubHead("비밀번호")}
            {/*TODO inputbox가 규격화 되어있어서 일단 이렇게 작성했어*/}
            <input type="checkbox" onChange={({ target: { checked } }) => setUseKeyPair(checked)} />키 페어 방식 사용
            {useKeyPair ?
                <div className="input_box">
                    <input type="file" placeholder="키 파일을 선택하시오" onChange={handleFileChange}/>
                </div>
                : InputBox(pwInputBoxProps)}

            {SubHead("연장 기간")}
            {DatePick(endDatePickProps)}
            <button className="submit_button" onClick={(e) => {submit(e)}}>연장 신청</button>
        </div>
    );
}