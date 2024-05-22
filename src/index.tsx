import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {OverViewPage} from "./pages/over_view_page/OverViewPage";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import {IndexContext} from "./context/SidebarContext";
import RentalPage from "./pages/rental_page/RentalPage";
import ExtensionPage from "./pages/extension_page/ExtensionPage";
import ReturnPage from "./pages/return_page/ReturnPage";
import ContainerExtensionPage from "./pages/container_extension_page/ContainerExtensionPage";
import ContainerReturnPage from "./pages/container_return_page/ContainerReturnPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//TODO 모든 활동 실패시 입력칸 초기화 기능 추가 필요
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Header/>
            <div className="content_body">
              <IndexContext>
                <Sidebar/>
                <div className="main_content">
                  <Routes>
                      <Route path="/" element={<OverViewPage />}/>
                      <Route path="/server/rental" element={<RentalPage />}/>
                      <Route path="/server/extension" element={<ExtensionPage />}/>
                      <Route path="/server/return" element={<ReturnPage />}/>
                      <Route path="/container/extension" element={<ContainerExtensionPage/>}/>
                      <Route path="/container/return" element={<ContainerReturnPage/>}/>
                  </Routes>
                </div>
              </IndexContext>
            </div>
      </BrowserRouter>
</React.StrictMode>
);
