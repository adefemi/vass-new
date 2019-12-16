import React, { useState, useEffect } from "react";
import { Card } from "../../../components/common";
import TabCategory from "./components/TabCategory";
import TabNetwork from "./components/TabNetworks";
import TabPaymentChannel from "./components/TabPayment";
import TabAccountSetup from "./components/TabAccount";
import TabDnd, { BlackListed } from "./components/TabDnd";
import TabBankAccount, { BankAccounts } from "./components/TabBankAccount";
import RoleController from "./components/roleController";
import Utilities from "./views/utilities";

function Account(props) {
  const [activeTab, setActiveTab] = useState(1);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    let linkArray = props.history.location.search.split("?");
    let activeLink = linkArray[linkArray.length - 1];

    switch (activeLink) {
      case "category":
        setActiveTab(1);
        break;
      case "network":
        setActiveTab(2);
        break;
      case "channel":
        setActiveTab(3);
        break;
      default:
    }
    props.history.replace(props.history.location.pathname);
  }, props.history.location.pathname);

  return (
    <div className={"max-width-1200"}>
      <div className="heading-main">Settings</div>
      <Card round>
        <div className="tab-heading">
          <li
            className={`${activeTab === 1 && "active"}`}
            onClick={() => setActiveTab(1)}
          >
            Categories
          </li>
          <li
            className={`${activeTab === 2 && "active"}`}
            onClick={() => setActiveTab(2)}
          >
            Networks
          </li>
          <li
            className={`${activeTab === 3 && "active"}`}
            onClick={() => setActiveTab(3)}
          >
            Payment Channel
          </li>
          <li
            className={`${activeTab === 4 && "active"}`}
            onClick={() => setActiveTab(4)}
          >
            Account Setup
          </li>
          <li
            className={`${activeTab === 5 && "active"}`}
            onClick={() => setActiveTab(5)}
          >
            Utilities
          </li>
          <li
            className={`${activeTab === 7 && "active"}`}
            onClick={() => setActiveTab(7)}
          >
            Blacklist
          </li>
          <li
            className={`${activeTab === 8 && "active"}`}
            onClick={() => setActiveTab(8)}
          >
            Bank Accounts
          </li>
          <li
            className={`${activeTab === 9 && "active"}`}
            onClick={() => setActiveTab(9)}
          >
            Roles/Permissions
          </li>
        </div>

        <div className="tab-content">
          <div
            className={`tab-item ${activeTab === 1 && "active"}`}
            id={"tab-category"}
          >
            <TabCategory {...props} />
          </div>
          <div
            className={`tab-item ${activeTab === 2 && "active"}`}
            id={"tab-category"}
          >
            <TabNetwork {...props} />
          </div>
          <div
            className={`tab-item ${activeTab === 3 && "active"}`}
            id={"tab-category"}
          >
            <TabPaymentChannel {...props} />
          </div>
          <div
            className={`tab-item ${activeTab === 4 && "active"}`}
            id={"tab-category"}
          >
            <TabAccountSetup {...props} />
          </div>
          <div
            className={`tab-item ${activeTab === 5 && "active"}`}
            id={"tab-category"}
          >
            <Utilities {...props} />
          </div>
          <div
            className={`tab-item ${activeTab === 7 && "active"}`}
            id={"tab-category"}
          >
            <TabDnd {...props} setTrigger={setTrigger} />
          </div>
          <div
            className={`tab-item ${activeTab === 8 && "active"}`}
            id={"tab-category"}
          >
            <TabBankAccount {...props} setTrigger={setTrigger} />
          </div>
          <div
            className={`tab-item ${activeTab === 9 && "active"}`}
            id={"tab-role"}
          >
            <RoleController {...props} />
          </div>
        </div>
      </Card>

      {activeTab === 7 && (
        <BlackListed trigger={trigger} setTrigger={setTrigger} />
      )}
      {activeTab === 8 && (
        <BankAccounts trigger={trigger} setTrigger={setTrigger} />
      )}
    </div>
  );
}

export default Account;
