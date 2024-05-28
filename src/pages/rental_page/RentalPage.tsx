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


export default function RentalPage() {
    const {selected} = useContext(SidebarContext);
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
        data.map((item: any) => {
            setNetworkData((prev:ComboBoxItem[]) => [...prev, {
                value: item.name + ':' + item.subnet_cidr,
                label: item.name + ' / ' + item.subnet_cidr
            }]);
        });
    };
    useEffect(() => {
    }, []);
    const networkProps: ComboBoxProps = {name: 'network_dropdown', items: networkData, change: setNetwork}

    //cloud init
    const [cloudInitData, setCloudInitData] = useState<string>('')
    const cloudInitChange = (target:any) => {
        setCloudInitData(target.value)
    }
    const couldInitInputBoxProps:InputBoxProps = {type:"text", placeholder:"",
        value:cloudInitData, change: cloudInitChange}


    useEffect(() => {
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
        if (name === "" || serverName === "" || (password === "" && useKeyPair) || image === "") {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
            return
        }
        let networkName = null;
        let subnetCidr = null;
        let cloudInit = null;
        if (advancedSetting) {
            networkName = createNetwork ? null : network.split(':')[0];
            subnetCidr = createNetwork ? null : network.split(':')[1];
            cloudInit = cloudInitData;
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user_name    : name,
                server_name  : serverName,
                start_date   : startDate.toISOString().split("T")[0],
                end_date     : endDate.toISOString().split("T")[0],
                image_name   : image,
                flavor_name  : flavorData[flavor].name,
                vcpus        : flavorData[flavor].cpu,
                ram          : flavorData[flavor].ram,
                disk         : flavorData[flavor].disk,
                network_name : networkName,
                subnet_cidr  : subnetCidr,
                password     : useKeyPair ? "" : password,
                cloud_init   : cloudInit
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(({name, private_key}) => {
            if(useKeyPair) {
                const blob = new Blob([private_key], {type: 'plain/text'});
                const file = new File([blob], name, {type: 'plain/text'});
                downloadFile(file);
            }
            alert("대여 완료")
            setIsBtnDisabled(false)
        }).catch((error) => {
            console.log(error)
        });
    }


    const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        rentalServer()
    }

    //Button disable state
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)



    return (
        <div>
            {PageHeader(sidebarPanel[selected].name)}
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
            flavor 지정
            {SelectTable(selectTableProps)}
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
                        {InputBox(couldInitInputBoxProps)}
                        {SubHead("네트워킹")}
                        <input type="checkbox" onChange={({target: {checked}}) => setCreateNetwork(checked)}/>기존 네트워크에
                        연결
                        {createNetwork ?
                            null :
                            (ComboBox(networkProps))
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