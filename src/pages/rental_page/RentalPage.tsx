import PageHeader from "../../components/header/PageHeader";
import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../../context/SidebarContext";
import {
    DatePickProps,
    InputBoxProps, RadioListItem, RadioListProps,
    SelectTableItem,
    SelectTableProps,
    SERVER_URL,
    sidebarPanel, TableData
} from "../../config/Config";
import SubHead from "../../components/subhead/SubHead";
import InputBox from "../../components/InputBox/InputBox";
import DatePick from "../../components/datePick/DatePick";
import SelectTable from "../../components/selectTable/SelectTable";
import Loading from "../../components/loading/Loading";
import RadioList from "../../components/radioList/RadioList";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;


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

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const startDateChange = (value: Date) => {setStartDate(value)}
    const endDateChange = (value: Date) => {setEndDate(value)}
    const startDatePickProps:DatePickProps = {date: startDate, change: startDateChange}
    const endDatePickProps:DatePickProps = {date: endDate, change: endDateChange}

    // set image radio list
    const [image, setImage] = useState<string>('');
    const imageUrl = SERVER_URL + "/openstack/image_list";
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
    useEffect(() => {
         fetch(imageUrl, {
             method: 'GET'
         }).then(res => res.json()).then((result) => {
             makeImageData(result);
             setImageLoading(false);
         }).catch((error) => {
             setImageLoadError(true);
         })
    }, []);
    const radioListProps: RadioListProps = {name: 'image', items: imageData, change: setImage}

    // set flavor select table
    const [flavor, setFlavor] = useState<number>(0);
    const flavorChange = (value: number) => {setFlavor(value)}
    const flavorUrl = SERVER_URL + "/openstack/flavor_list";
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
    useEffect(() => {
        fetch(flavorUrl, {
            method: 'GET'
        }).then(res => res.json()).then((result) => {
            makeFlavorTableData(result);
            setFlavorLoading(false);
        }).catch((error) => {
            setFlavorLoadError(true);
        });
    }, []);
    const selectTableProps: SelectTableProps = {rows:flavorData, change: flavorChange}

    // rental request
    const url:string = SERVER_URL + "/openstack/rental"
    const rentalServer = async () => {
        if (name === "" || serverName === "" || (password === "" && !useKeyPair) || image === "" || flavor === 0) {
            alert("모든 항목을 입력해주세요")
            setIsBtnDisabled(false)
            return
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
                network_name : "shared",
                password     : useKeyPair ? "" : password,
                cloud_init   : "",
                node_name    : "compute_node1",
                vcpus        : null,
                ram          : null,
                disk         : null
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
            <input type="checkbox" onChange={({ target: { checked } }) => setUseKeyPair(checked)}></input>
            키 페어 방식 사용
            {useKeyPair ? null : InputBox(pwInputBoxProps)}

            {SubHead("대여 기간")}
            {DatePick(startDatePickProps)}
            {DatePick(endDatePickProps)}

            {SubHead("OS 이미지")}
            {RadioList(radioListProps)}
            {imageLoadError ? SubHead("서버로부터 응답이 없습니다.") :
                imageLoading ? <Loading/> : null}

            {SubHead("Flavor")}
            {SelectTable(selectTableProps)}
            {flavorLoadError ? SubHead("서버로부터 응답이 없습니다.") :
                flavorLoading ? <Loading/> : null}

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