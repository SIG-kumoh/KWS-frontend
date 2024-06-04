import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import PageHeader from "../../components/header/PageHeader";
import {DatePickProps, InputBoxProps, SERVER_URL, sidebarPanel} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import {useLocation} from "react-router-dom";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/Modal";

export default function ExtensionPage() {
    const {state} = useLocation()
    const {selected, setSelected} = useContext(SidebarContext);
    const hasInfo:boolean = (state != undefined)
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

    //modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
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
        handleOpenModal()
        fetch(url, {
            method: 'PUT',
            body: formData
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
            setIsBtnDisabled(false)
        })
    }
    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsBtnDisabled(true)
        if (hasInfo && (password === "" && !useKeyPair)) {
            alert("비밀번호를 입력해주세요")
            setIsBtnDisabled(false)
        } else if (hasInfo) {
            extensionServer()
        } else if(serverName === "" || (password === "" && !useKeyPair) || ip === "") {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
        } else {
            extensionServer()
        }
    }
    useEffect(()=>
        setSelected(2)
    )

    return (
        <div>
            <Modal show={isModalOpen} onClose={handleCloseModal}>
                <div className="modal_content">
                    <h2>서버 연장 신청중</h2>
                    <Loading/>
                </div>
            </Modal>
            {PageHeader('서버 연장')}

            <div className="inner_content">
                {SubHead("인스턴스명")}
                {hasInfo ? SubHead(state.server_name) : InputBox(serverNameInputBoxProps)}

                {SubHead("IP")}
                {hasInfo ? SubHead(state.host_ip) : InputBox(ipInputBoxProps)}

                {SubHead("비밀번호")}

                <div className="check-row">
                    <input type="checkbox" onChange={({ target: { checked } }) => setUseKeyPair(checked)} />키 페어 방식 사용
                </div>
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
        </div>
    );
}