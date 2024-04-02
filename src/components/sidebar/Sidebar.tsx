import '../../css/_sidebar.css'

export default function Sidebar() {
    return (
        <div className="sidebar">
            <ul className="sidebar_menu">
                <li className="sidebar_panel">
                    <a>서버 현황</a>
                </li>
                <li className="sidebar_panel">
                    <a>서버 대여</a>
                </li>
                <li className="sidebar_panel">
                    <a>서버 연장</a>
                </li>
                <li className="sidebar_panel">
                    <a>서버 반납</a>
                </li>
            </ul>
        </div>
    )
}