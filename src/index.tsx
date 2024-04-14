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
                      <Route path="/rental" element={<RentalPage />}/>
                      <Route path="/extension" element={<ExtensionPage />}/>
                      <Route path="/return" element={<ReturnPage />}/>
                  </Routes>
                </div>
              </IndexContext>
            </div>
      </BrowserRouter>
</React.StrictMode>
);
