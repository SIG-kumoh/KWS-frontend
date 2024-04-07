import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {OverViewPage} from "./pages/over_view_page/OverViewPage";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import {IndexContext} from "./context/SidebarContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

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
                      {/* 페이지 수정 필요 */}
                      <Route path="/rental" element={<OverViewPage />}/>
                      <Route path="/extension" element={<OverViewPage />}/>
                      <Route path="/return" element={<OverViewPage />}/>
                  </Routes>
                </div>
              </IndexContext>
            </div>
      </BrowserRouter>
</React.StrictMode>
);
