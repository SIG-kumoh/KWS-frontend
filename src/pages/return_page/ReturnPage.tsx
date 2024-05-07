import React, {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import PageHeader from "../../components/header/PageHeader";
import {InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import {useLocation} from "react-router-dom";

export default function ReturnPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = state != undefined
    if(state != undefined) {
        setSelected(3)
    }
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [useKeyPair, setUseKeyPair] = useState<boolean>(false)
    const [keyFile, setKeyFile] = useState<File>(new File([], ''));
    const [ip, setIp] = useState<string>("")
    const url = SERVER_URL + "/openstack/return"
    const nameChange = (target:any) => {
        setName(target.value)
    }
    const pwChange = (target:any) => {
        setPassword(target.value)
    }
    const ipChange = (target:any) => {
        setIp(target.value)
    }
    const handleFileChange = (target:any) => {
        setKeyFile(target.files[0]);
    }
    const nameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:name, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type: useKeyPair ? "file" : "password", placeholder:"비밀번호를 입력하시오",
        value:password, change: useKeyPair ? handleFileChange : pwChange}
    const ipInputBoxProps:InputBoxProps = {type:"text", placeholder:"IP를 입력하시오",
        value:ip, change: ipChange}

    const returnServer = async () => {
        const formData = new FormData()
        if(hasInfo) {
            formData.append('server_name', state.server_name);
            formData.append('host_ip', state.host_ip);
        } else {
            formData.append('server_name', name);
            formData.append('host_ip', ip);
        }
        formData.append('password', (useKeyPair ? '' : password));
        if (useKeyPair) formData.append('key_file', keyFile);

        fetch(url, {
            method: 'DELETE',
            body: formData
        }).then(res => res).then(res => res.ok ? alert("반납 완료") : alert("반납 실패"))
            .catch((error) => {console.error('Error:', error)})
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        returnServer()
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {hasInfo ? SubHead(state.server_name) : InputBox(nameInputBoxProps)}

            {SubHead("IP")}
            {hasInfo ? SubHead(state.host_ip) : InputBox(ipInputBoxProps)}

            {SubHead("비밀번호")}
            <input type="checkbox" onChange={({ target: { checked } }) => setUseKeyPair(checked)} />키 페어 방식 사용
            {InputBox(pwInputBoxProps)}

            <button className="submit_button" onClick={(e) => {submit(e)}}>반납 신청</button>
        </div>
    );
}