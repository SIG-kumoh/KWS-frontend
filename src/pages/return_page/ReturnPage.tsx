import {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import PageHeader from "../../components/header/PageHeader";
import {InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";

export default function ReturnPage() {
    const {selected} = useContext(SidebarContext);
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [ip, setIp] = useState<string>("")
    const url = SERVER_URL + "/return"
    const nameChange = (value:string) => {
        setName(value)
    }
    const pwChange = (value:string) => {
        setPassword(value)
    }
    const ipChange = (value:string) => {
        setIp(value)
    }
    const nameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:name, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type:"password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}
    const ipInputBoxProps:InputBoxProps = {type:"text", placeholder:"IP를 입력하시오",
        value:ip, change: ipChange}

    const returnMutation = async () => {
        const response = await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({server_name: name, host_ip: ip, password: password}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res).then(res => res.ok ? alert("반납이 완료되었습니다.") : alert("반납에 실패하였습니다."))
            .catch((error) => {console.error('Error:', error)})
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        returnMutation()
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {InputBox(nameInputBoxProps)}
            {SubHead("IP")}
            {InputBox(ipInputBoxProps)}
            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}
            <button className="submit_button" onClick={(e) => {submit(e)}}>반납 신청</button>
        </div>
    );
}