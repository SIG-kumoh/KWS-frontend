import {useLocation} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {DatePickProps, InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import PageHeader from "../../components/header/PageHeader";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/Modal";

export default function ContainerExtensionPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = state != undefined
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

    const url:string = SERVER_URL + "/container/extension"
    const extensionServer = async () => {
        handleOpenModal()
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                container_name: hasInfo? state:containerName,
                password: password,
                end_date: endDate.toISOString().split("T")[0]
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
                alert("연장 완료");
            } else {
                alert(res.data);
            }
        }).catch((error) => {
            alert("연장 실패");
            console.log(error);
        }).finally(() => {
            handleCloseModal();
            setIsBtnDisabled(false);
        })
    }
    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsBtnDisabled(true)
        if (hasInfo && password === "") {
            alert("비밀번호를 입력해주세요")
            setIsBtnDisabled(false)
        } else if (hasInfo) {
            extensionServer()
        } else if(containerName === "" || password === "") {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
        } else {
            extensionServer()
        }
    }
    useEffect(()=>
        setSelected(5)
    )

    //modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Modal show={isModalOpen} onClose={handleCloseModal}>
                <div className="modal_content">
                    <h2>컨테이너 연장중</h2>
                    <Loading/>
                </div>
            </Modal>
            {PageHeader(sidebarPanel[selected].name)}
            {SubHead("컨테이너명")}
            {hasInfo ? SubHead(state) : InputBox(containerNameInputBoxProps)}

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