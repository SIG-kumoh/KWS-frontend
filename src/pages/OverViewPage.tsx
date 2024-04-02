import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import "../css/_over_view_page.css"
import PageHeader from "../components/header/PageHeader";

export function OverViewPage() {
    return (
        <div>
            <Header/>
            <div className="content_body">
                <Sidebar/>
                <div className="main_content">
                    {PageHeader("개요")}
                </div>
            </div>
        </div>
    );
}