import React, { useEffect, useState } from "react";
import CategorySupport from "./components/category";
import Tickets from "./components/tickets";
import { USERACCESSCONTROL } from "../../utils/data";
import { Notification } from "../../../components/common/notification";

function SupportMain(props) {
  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.support;
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!user_access || !user_access.status) {
      Notification.bubble({
        type: "error",
        content: "You don't have access to this page"
      });
      props.history.push("/");
    } else {
      setActiveTab(user_access.data.category ? 1 : 2);
    }
  }, []);

  if (activeTab) {
    return (
      <div>
        {user_access.data.tabSwitch && (
          <div className="breadcrum">
            <li
              className={activeTab === 1 ? "active" : ""}
              onClick={() => setActiveTab(1)}
            >
              Categories
            </li>
            <li
              className={activeTab === 2 ? "active" : ""}
              onClick={() => setActiveTab(2)}
            >
              Tickets
            </li>
          </div>
        )}

        {activeTab === 1 && user_access.data.category && (
          <CategorySupport access={user_access.data.supportCategories.data} />
        )}
        {activeTab === 2 && user_access.data.ticket && (
          <Tickets access={user_access.data.supportTicket.data} />
        )}
      </div>
    );
  }

  return <div>-</div>;
}

export default SupportMain;
