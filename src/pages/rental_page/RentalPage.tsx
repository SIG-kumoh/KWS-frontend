import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {
    ComboBoxItem,
    ComboBoxProps,
    DatePickProps,
    InputBoxProps, RadioListItem, RadioListProps,
    SelectTableItem,
    SelectTableProps,
    SERVER_URL,
    sidebarPanel,
} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import SelectTable from "../../components/selectTable/SelectTable";
import Loading from "../../components/loading/Loading";
import RadioList from "../../components/radioList/RadioList";
import ArrowUp from "../../components/svg/ArrowUp";
import "./rental_page.css";
import ArrowDown from "../../components/svg/ArrowDown";
import ComboBox from "../../components/comboBox/ComboBox";
import Help from "../../components/svg/Help";
import Modal from "../../components/modal/Modal";


export default function RentalPage() {
    const {selected, setSelected} = useContext(SidebarContext);
    const [name, setName] = useState<string>("")
    const [serverName, setServerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const nameChange = (target:any) => {
        setName(target.value)
    }
    const serverNameChange = (target:any) => {
        setServerName(target.value)
    }
    const pwChange = (target:any) => {
        setPassword(target.value)
    }
    const nameInputBoxProps: InputBoxProps = {type:"text", placeholder:"사용자명을 입력하시오",
        value:name, change: nameChange}
    const serverNameInputBoxProps:InputBoxProps = {type:"text", placeholder:"인스턴스명을 입력하시오",
        value:serverName, change: serverNameChange}
    const pwInputBoxProps:InputBoxProps = {type:"password", placeholder:"비밀번호를 입력하시오",
        value:password, change: pwChange}

    const [useKeyPair, setUseKeyPair] = useState<boolean>(false)
    const [customFlavor, setCustomFlavor] = useState<boolean>(false)
    const [advancedSetting, setAdvancedSetting] = useState<boolean>(false)

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const startDateChange = (value: Date) => {setStartDate(value)}
    const endDateChange = (value: Date) => {setEndDate(value)}
    const startDatePickProps:DatePickProps = {date: startDate, change: startDateChange}
    const endDatePickProps:DatePickProps = {date: endDate, change: endDateChange}


    // set image radio list
    const [image, setImage] = useState<string>('');
    const imageUrl = SERVER_URL + "/image/list";
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);
    const [imageData, setImageData] = useState<RadioListItem[]>([])
    const makeImageData = (data: any) => {
        setImageData([]);
        data.map((item: any) => {
            setImageData((prev:RadioListItem[]) => [...prev,{
                value: item.name
            }]);
        });
    };
    const radioListProps: RadioListProps = {name: 'image', items: imageData, change: setImage}

    // set flavor select table
    const [flavor, setFlavor] = useState<number>(0);
    const flavorChange = (value: number) => {setFlavor(value)}
    const flavorUrl = SERVER_URL + "/flavor/list";
    const [flavorLoading, setFlavorLoading] = useState<boolean>(true);
    const [flavorLoadError, setFlavorLoadError] = useState<boolean>(false);
    const [flavorData, setFlavorData] = useState<SelectTableItem[]>([])
    const makeFlavorTableData = (data:any) => {
        setFlavorData([]);
        data.map((item:any) => {
            setFlavorData((prev:SelectTableItem[]) => [...prev, {
                name: item.name,
                cpu: item.cpu,
                ram: item.ram,
                disk: item.disk
            }]);
        });
    };
    const selectTableProps: SelectTableProps = {rows:flavorData, change: flavorChange}



    //advanced setting
    const networkUrl = SERVER_URL + '/network/list';
    const [createNetwork, setCreateNetwork] = useState<boolean>(false)
    const [networkData, setNetworkData] = useState<ComboBoxItem[]>([])
    const [network, setNetwork] = useState<string>('')
    const [networkLoading, setNetworkLoading] = useState<boolean>(true);
    const [networkLoadError, setNetworkLoadError] = useState<boolean>(false);
    const makeNetworkData = (data: any) => {
        setNetworkData([]);
        data = data.filter((e: any) => !e.is_external);
        data.map((item: any) => {
            setNetworkData((prev:ComboBoxItem[]) => [...prev, {
                value: item.name + ':' + item.subnet_cidr,
                label: item.name + ' ' + item.subnet_cidr
            }]);
        });
        try {
            setNetwork(data[0].name + ':' + data[0].subnet_cidr)
        } catch (e) {}
    };
    const networkProps: ComboBoxProps = {name: 'network_dropdown', items: networkData, change: setNetwork}

    //cloud init
    const [cloudInitData, setCloudInitData] = useState<string>('')
    const cloudInitChange = (target:any) => {
        setCloudInitData(target.value)
    }
    const couldInitInputBoxProps:InputBoxProps = {type:"text", placeholder:"",
        value:cloudInitData, change: cloudInitChange}


    useEffect(() => {
        setSelected(1)
        fetch(imageUrl, {
            method: 'GET'
        }).then(res => res.json()).then((result) => {
            makeImageData(result);
            setImageLoading(false);
        }).catch((error) => {
            setImageLoadError(true);
        })
        fetch(flavorUrl, {
            method: 'GET'
        }).then(res => res.json()).then((result) => {
            makeFlavorTableData(result);
            setFlavorLoading(false);
        }).catch((error) => {
            setFlavorLoadError(true);
        });
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
    const url:string = SERVER_URL + "/server/rental"
    const rentalServer = async () => {
        if (name === "" || serverName === "" || (password === "" && !useKeyPair) || image === "") {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
            return
        }
        let networkName = null;
        let subnetCidr = null;
        let cloudInit = null;
        if (advancedSetting) {
            networkName = createNetwork ? newNetworkName : network.split(':')[0];
            subnetCidr = createNetwork ? newSubnet : network.split(':')[1];
            cloudInit = cloudInitData;
        }
        handleOpenModal()
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user_name    : name,
                server_name  : serverName,
                start_date   : startDate.toISOString().split("T")[0],
                end_date     : endDate.toISOString().split("T")[0],
                image_name   : image,
                flavor_name  : customFlavor ? newFlavorName : flavorData[flavor].name,
                vcpus        : customFlavor ? newVcpu : flavorData[flavor].cpu,
                ram          : customFlavor ? newRam : flavorData[flavor].ram,
                disk         : customFlavor ? newDisk : flavorData[flavor].disk,
                network_name : networkName,
                subnet_cidr  : subnetCidr,
                password     : useKeyPair ? null : password,
                cloud_init   : cloudInit
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
                if (useKeyPair) {
                    const blob = new Blob([res.private_key], { type: 'plain/text' });
                    const file = new File([blob], `${serverName}.pem`, { type: 'plain/text' });
                    downloadFile(file);
                }
                alert("대여 완료");
            } else {
                alert(res.data);
            }
            setIsBtnDisabled(false);
            handleCloseModal()
        }).catch((error) => {
            alert("대여 실패");
            console.log(error);
            setIsBtnDisabled(false);
        });
    }


    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        rentalServer()
    }

    //Button disable state
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)


    const [newFlavorName, setNewFlavorName] = useState<string>('')
    const [newVcpu, setNewVcpu] = useState<string>('')
    const [newRam, setNewRam] = useState<string>('')
    const [newDisk, setNewDisk] = useState<string>('')

    const newFlavorNameChange = (target:any) => {
        setNewFlavorName(target.value)
    }
    const newVcpuChange = (target:any) => {
        setNewVcpu(target.value)
    }
    const newRamChange = (target:any) => {
        setNewRam(target.value)
    }
    const newDiskChange = (target:any) => {
        setNewDisk(target.value)
    }
    const newFlavorNameInputProps:InputBoxProps = {type:"text", placeholder:"인스턴스명",
        value:newFlavorName, change: newFlavorNameChange}
    const newVcpuInputProps:InputBoxProps = {type:"number", placeholder:"1,2,3,...",
        value:newVcpu, change: newVcpuChange}
    const newRamInputProps:InputBoxProps = {type:"number", placeholder:"MB",
        value:newRam, change: newRamChange}
    const newDiskInputProps:InputBoxProps = {type:"number", placeholder:"GB",
        value:newDisk, change: newDiskChange}


    const [newNetworkName, setNewNetworkName] = useState<string>("")
    const [newSubnet, setNewSubnet] = useState<string>("")
    const newNetworkNameChange = (target:any) => {
        setNewNetworkName(target.value)
    }
    const newSubnetChange = (target:any) => {
        setNewSubnet(target.value)
    }
    const newNetworkNameInputProps:InputBoxProps = {type:"text", placeholder:"네트워크명 기본값: shared",
        value:newNetworkName, change: newNetworkNameChange}
    const newSubnetInputProps:InputBoxProps = {type:"text", placeholder:"ex) 192.168.233.0/24",
        value:newSubnet, change: newSubnetChange}

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
                    <h2>서버 대여 신청중</h2>
                    <Loading/>
                </div>
            </Modal>
            {PageHeader('서버 대여')}
            {SubHead("사용자명")}
            {InputBox(nameInputBoxProps)}

            {SubHead("인스턴스명")}
            {InputBox(serverNameInputBoxProps)}

            {SubHead("비밀번호")}
            <input type="checkbox" onChange={({target: {checked}}) => setUseKeyPair(checked)}></input>
            키 페어 방식 사용
            {useKeyPair ? null : InputBox(pwInputBoxProps)}

            {SubHead("대여 기간")}
            <div className="date_pick_container">
                {DatePick(startDatePickProps)}
                {SubHead("~")}
                {DatePick(endDatePickProps)}
            </div>


            {SubHead("OS 이미지")}
            {RadioList(radioListProps)}
            {imageLoadError ? SubHead("서버로부터 응답이 없습니다.") :
                imageLoading ? <Loading/> : null}

            {SubHead("Flavor")}
            <input type="checkbox" onChange={({target: {checked}}) => setCustomFlavor(checked)}></input>
            커스텀 flavor
            <div className="select_box" style={{display: customFlavor?'block':'none'}}>
                <table>
                    <thead><tr>
                        <th>프리셋</th>
                        <th>VCPUS(개)</th>
                        <th>RAM(MB)</th>
                        <th>디스크 총계(GB)</th>
                    </tr></thead>
                    <tbody><tr>
                        <td>{InputBox(newFlavorNameInputProps)}</td>
                        <td>{InputBox(newVcpuInputProps)}</td>
                        <td>{InputBox(newRamInputProps)}</td>
                        <td>{InputBox(newDiskInputProps)}</td>
                    </tr></tbody>
                </table>
            </div>
            <div className="flavor_select" style={{display: customFlavor?'none':'block'}}>
                {SelectTable(selectTableProps)}
            </div>
            {flavorLoadError ? SubHead("서버로부터 응답이 없습니다.") :
                flavorLoading ? <Loading/> : null}

            <div className="advanced_setting_container">
                <div className="advanced_setting_header" onClick={() => setAdvancedSetting(!advancedSetting)}>
                    {advancedSetting ? ArrowDown() : ArrowUp()}
                    {SubHead("고급 설정")}
                </div>
                {advancedSetting ?
                    <div className="advanced_setting_content">
                        <div className="cloud_init_container">
                            {SubHead("Cloud-init")}
                            <span className="cloud_svg_container"
                                  data-tooltip-text="가상 머신이 설치되는 동안 cloud-init 스트립트가 실행됩니다 #cloud-config은 빼고 입력하세요"
                            >
                                <Help/>
                            </span>
                        </div>
                        <textarea className="cloud_init_textarea"
                                  onChange={({target: {value}}) => setCloudInitData(value)}></textarea>
                        {SubHead("네트워킹")}

                        <input type="checkbox" onChange={({target: {checked}}) => setCreateNetwork(checked)}/>
                        새로운 네트워크에 연결
                        {createNetwork ?
                            <div className="new_network_container">
                                <span className="new_network_name">
                                    <h4>네트워크 이름</h4>
                                </span>
                                {InputBox(newNetworkNameInputProps)}
                                <span className="new_subnet">
                                    <h4>서브넷(CIDR)</h4>
                                </span>
                                {InputBox(newSubnetInputProps)}
                            </div> :
                            ComboBox(networkProps)
                        }

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


function downloadFile(file: File) {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}