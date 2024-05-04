import React, {useContext, useState} from "react";
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
    const url = SERVER_URL + "/openstack/return"
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

    const returnServer = async () => {
        const formData = new FormData()
        formData.append('server_name', name);
        formData.append('host_ip', ip);
        formData.append('password', (useKeyPair ? '' : password));
        if (useKeyPair) formData.append('key_file', keyFile);

        fetch(url, {
            method: 'DELETE',
            body: formData
        }).then(res => res).then(res => res.ok ? alert("반납이 완료되었습니다.") : alert("반납에 실패하였습니다."))
            .catch((error) => {console.error('Error:', error)})
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        returnServer()
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
            {InputBox(nameInputBoxProps)}

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

            <button className="submit_button" onClick={(e) => {submit(e)}}>반납 신청</button>
        </div>
    );
}