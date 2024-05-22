import {useLocation} from "react-router-dom";
import React, {useContext, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import PageHeader from "../../components/header/PageHeader";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";

export default function ContainerReturnPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = state != undefined
    if(state != undefined) {
        setSelected(3)
    }
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    //Button disable state
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)
    const url = SERVER_URL + "/container/return"
    const nameChange = (target:any) => {
        setName(target.value)
    }
    const pwChange = (target:any) => {
        setPassword(target.value)
    }
    const nameInputBoxProps:InputBoxProps = {type:"text", placeholder:"컨테이너명을 입력하시오",
        value:name, change: nameChange}
    const pwInputBoxProps:InputBoxProps = {type: "password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}

    const returnServer = async () => {
        const formData = new FormData()
        if(hasInfo) {
            formData.append('container_name', state.container_name);
        } else {
            formData.append('container_name', name);
        }
        formData.append('password',  password);
        fetch(url, {
            method: 'DELETE',
            body: formData
        }).then(res => res).then(res => res.ok ? alert("반납 완료") : alert("반납 실패"))
            .catch((error) => {console.error('Error:', error)})
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setIsBtnDisabled(true)
        if(name === "" || password === "") {
            alert("모든 항목을 입력해주세요")
            return
        }
        returnServer()
    }

    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("컨테이너명")}
            {hasInfo ? SubHead(state.container_name) : InputBox(nameInputBoxProps)}

            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}

            <button className="submit_button"
                    disabled={isBtnDisabled}
                    onClick={(e) => {submit(e)}}>
                {isBtnDisabled ? "반납 신청 중" : "반납 신청"}
            </button>
        </div>
    );
}