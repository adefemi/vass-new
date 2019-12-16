import React, { Fragment, useState } from "react";
import TabRevenueSharing from "../components/TabRevenue";
import TabFinance from "../components/TabFinance";
import GeneralSettings from "./GeneralSettings";

function Utilities(props) {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div>
      <div className="flex">
        <div className="v-tab">
          <li
            onClick={() => {
              setActiveTab(1);
            }}
            className={activeTab === 1 ? "active" : ""}
          >
            Revenue Sharing
          </li>
          <li
            onClick={() => {
              setActiveTab(2);
            }}
            className={activeTab === 2 ? "active" : ""}
          >
            General Settings
          </li>
          <li
            onClick={() => {
              setActiveTab(3);
            }}
            className={activeTab === 3 ? "active" : ""}
          >
            Notification Messages
          </li>
        </div>
        <div className="flex-1">
          {activeTab === 1 && <TabRevenueSharing {...props} />}
          {activeTab === 2 && <TabFinance {...props} />}
          {activeTab === 3 && <GeneralSettings {...props} />}
        </div>
      </div>
    </div>
  );
}

export default Utilities;
