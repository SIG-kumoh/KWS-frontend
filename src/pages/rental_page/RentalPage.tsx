import PageHeader from "../../components/header/PageHeader";
import {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {InputBoxProps, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";

export default function RentalPage() {
    const {selected} = useContext(SidebarContext);
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const nameChange = (value:string) => {
        setName(value)
    }
    const pwChange = (value:string) => {
        setPassword(value)
    }
    const nameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:name, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type:"password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}
    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("인스턴스명")}
            {InputBox(nameInputBoxProps)}
            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}
            {SubHead("대여 기간")}
            {SubHead("OS 이미지")}
            <h5>Ubuntu</h5>
            {SubHead("Flavor")}
            <button className="submit_button">대여 신청</button>
        </div>
    );
}