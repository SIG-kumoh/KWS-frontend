import {useLocation} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import PageHeader from "../../components/header/PageHeader";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";

export default function ContainerReturnPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = (state != undefined)
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
        fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({
                container_name: hasInfo? state:name,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json().then(data => {
                if (!res.ok) {
                    return { res: data, state: false };
                } else {
                    return { res: data, state: true };
                }
            });
        }).then(({ res, state }) => {
            if (state) {
                alert("반납 완료");
            } else {
                alert(res.data);
            }
            setIsBtnDisabled(false);
        }).catch((error) => {
            alert("반납 실패");
            console.log(error);
            setIsBtnDisabled(false);
        });
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setIsBtnDisabled(true)
        if (hasInfo && password === "") {
            alert("비밀번호를 입력해주세요")
            setIsBtnDisabled(false)
        } else if (hasInfo) {
            returnServer()
        } else if(name === "" || password === "") {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
        } else {
            returnServer()
        }
    }

    useEffect(()=>
        setSelected(6)
    )

    return (
        <div>
            {PageHeader("컨테이너 반납")}
            {SubHead("컨테이너명")}
            {hasInfo ? SubHead(state) : InputBox(nameInputBoxProps)}

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