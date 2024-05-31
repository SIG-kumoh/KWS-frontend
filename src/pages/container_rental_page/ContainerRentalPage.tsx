import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {
    ComboBoxItem,
    ComboBoxProps,
    DatePickProps,
    InputBoxProps,
    SERVER_URL,
    sidebarPanel,
} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import ArrowUp from "../../components/svg/ArrowUp";
import ArrowDown from "../../components/svg/ArrowDown";
import ComboBox from "../../components/comboBox/ComboBox";
import Help from "../../components/svg/Help";
import "./container_rental_page.css";


export default function ContainerRentalPage() {
    const {selected, setSelected} = useContext(SidebarContext);
    const [name, setName] = useState<string>("")
    const [containerName, setContainerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const nameChange = (target:any) => {
        setName(target.value)
    }
    const containerNameChange = (target:any) => {
        setContainerName(target.value)
    }
    const pwChange = (target:any) => {
        setPassword(target.value)
    }
    const imageChange = (target:any) => {
        setImage(target.value)
    }
    const nameInputBoxProps: InputBoxProps = {type:"text", placeholder:"사용자명을 입력하시오",
        value:name, change: nameChange}
    const serverNameInputBoxProps:InputBoxProps = {type:"text", placeholder:"컨테이너명을 입력하시오",
        value:containerName, change: containerNameChange}
    const pwInputBoxProps:InputBoxProps = {type:"password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}
    const imageInputBoxProps:InputBoxProps = {type:"text", placeholder:"도커허브에서 가져올 이미지 이름을 입력하시오",
        value:image, change: imageChange}

    const [advancedSetting, setAdvancedSetting] = useState<boolean>(false)

    //set date select
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const startDateChange = (value: Date) => {setStartDate(value)}
    const endDateChange = (value: Date) => {setEndDate(value)}
    const startDatePickProps:DatePickProps = {date: startDate, change: startDateChange}
    const endDatePickProps:DatePickProps = {date: endDate, change: endDateChange}


    //advanced setting
    const networkUrl = SERVER_URL + '/network/list';
    const [createNetwork, setCreateNetwork] = useState<boolean>(false)
    const [networkData, setNetworkData] = useState<ComboBoxItem[]>([])
    const [network, setNetwork] = useState<string>('')
    const [networkLoading, setNetworkLoading] = useState<boolean>(true);
    const [networkLoadError, setNetworkLoadError] = useState<boolean>(false);
    const makeNetworkData = (data: any) => {
        setNetworkData([]);
        data.map((item: any) => {
            setNetworkData((prev:ComboBoxItem[]) => [...prev, {
                value: item.name + ':' + item.subnet_cidr,
                label: item.name + ' / ' + item.subnet_cidr
            }]);
        });
        setNetwork(networkData[0].value)
    };
    useEffect(() => {
    }, []);
    const networkProps: ComboBoxProps = {name: 'network_dropdown', items: networkData, change: setNetwork}

    //set env data
    const [envData, setEnvData] = useState<string>("")
    const envChange = (target:any) => {
        setEnvData(target.value)
    }
    const envInputBoxProps:InputBoxProps = {type:"text", placeholder:"KEY1=VALUE1,KEY2=VALUE2,...",
        value:envData, change: envChange}

    //set cmd data
    const [cmdData, setCmdData] = useState<string>("")
    const cmdChange = (target:any) => {
        setCmdData(target.value)
    }
    const cmdInputBoxProps:InputBoxProps = {type:"text", placeholder:"",
        value:cmdData, change: cmdChange}

    useEffect(() => {
        setSelected(4)
        fetch(networkUrl, {
            method: 'GET'
        }).then(res => res.json()).then((result) => {
            makeNetworkData(result);
            setNetworkLoading(false);
        }).catch((error) => {
            setNetworkLoadError(true);
        })
    }, []);


    // rental request
    const url:string = SERVER_URL + "/container/rental"
    const rentalContainer = async () => {
        if (name === "" || containerName === "" || password === "" || image === "") {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
            return
        }
        let networkName = null;
        let subnetCidr = null;
        let env = null;
        let cmd = null;
        if (advancedSetting) {
            networkName = createNetwork ? newNetworkName : network.split(':')[0];
            subnetCidr = createNetwork ? newSubnet : network.split(':')[1];
            env = envData === "" ? null : envData;
            cmd = cmdData === "" ? null : cmdData;
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user_name       : name,
                container_name  : containerName,
                start_date      : startDate.toISOString().split("T")[0],
                end_date        : endDate.toISOString().split("T")[0],
                image_name      : image,
                network_name    : networkName,
                subnet_cidr     : subnetCidr,
                password        : password,
                env             : env,
                cmd             : cmd
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
                alert("대여 완료");
            } else {
                alert(res.data);
            }
            setIsBtnDisabled(false);
        }).catch((error) => {
            alert("대여 실패");
            console.log(error);
            setIsBtnDisabled(false);
        });
    }

    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        rentalContainer()
    }

    //Button disable state
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)


    const [newNetworkName, setNewNetworkName] = useState<string>("")
    const [newSubnet, setNewSubnet] = useState<string>("")
    const newNetworkNameChange = (target:any) => {
        setNewNetworkName(target.value)
    }
    const newSubnetChange = (target:any) => {
        setNewSubnet(target.value)
    }
    const newNetworkNameInputProps:InputBoxProps = {type:"text", placeholder:"",
        value:newNetworkName, change: newNetworkNameChange}
    const newSubnetInputProps:InputBoxProps = {type:"text", placeholder:"",
        value:newSubnet, change: newSubnetChange}

    return (
        <div>
            {PageHeader("컨테이너 대여")}
            {SubHead("사용자명")}
            {InputBox(nameInputBoxProps)}

            {SubHead("컨테이너명")}
            {InputBox(serverNameInputBoxProps)}

            {SubHead("비밀번호")}
            {InputBox(pwInputBoxProps)}

            {SubHead("대여 기간")}
            <div className="date_pick_container">
                {DatePick(startDatePickProps)}
                {SubHead("~")}
                {DatePick(endDatePickProps)}
            </div>

            {SubHead("이미지")}
            {InputBox(imageInputBoxProps)}


            <div className="advanced_setting_container">
                <div className="advanced_setting_header" onClick={() => setAdvancedSetting(!advancedSetting)}>
                    {advancedSetting ? ArrowDown() : ArrowUp()}
                    {SubHead("고급 설정")}
                </div>
                {advancedSetting ?
                    <div className="advanced_setting_content">
                        {SubHead("네트워킹")}

                        <input type="checkbox" onChange={({target: {checked}}) => setCreateNetwork(checked)}/>
                        새로운 네트워크에 연결
                        {createNetwork ?
                            <div className="new_network_container">
                                <span className="new_network_name">
                                    <h4>네트워크 이름</h4>
                                    {InputBox(newNetworkNameInputProps)}
                                </span>
                                <span className="new_subnet">
                                    <h4>서브넷(CIDR)</h4>
                                    {InputBox(newSubnetInputProps)}
                                </span>
                            </div> :
                            ComboBox(networkProps)
                        }

                        {SubHead("환경변수")}
                        {InputBox(envInputBoxProps)}
                        <div className="env_help">
                            {SubHead("명령어")}
                            <span className="help_svg_container"
                                data-tooltip-text="명령어A,명령어B의 꼴로 작성해주세요."
                            >
                                <Help/>
                            </span>
                        </div>
                        {InputBox(cmdInputBoxProps)}
                    </div> : null
                }
            </div>

            <button className="submit_button"
                    disabled={isBtnDisabled}
                    onClick={(e) => {
                        setIsBtnDisabled(true)
                        submit(e)
                    }}>
                {isBtnDisabled ? "대여 중" : "대여 신청"}
            </button>
        </div>
    );
}