import {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import PageHeader from "../../components/header/PageHeader";
import {InputBoxProps, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";

export default function ExtensionPage() {
    const {selected} = useContext(SidebarContext);
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [ip, setIp] = useState<string>("")
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
    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {InputBox(nameInputBoxProps)}
            {SubHead("IP")}
            {InputBox(ipInputBoxProps)}
            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}
            {SubHead("연장 기간")}
            <button className="submit_button">연장 신청</button>
        </div>
    );
}