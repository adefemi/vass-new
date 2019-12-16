import React, { useEffect, useState } from "react";
import { File, Gear, Group, Level } from "../../components/common/customIcon";
import { Icon } from "../../components/common";
import { Link } from "react-router-dom";
import { getUserAccess } from "../AdminComponents/finance/Finance";
import { USERDATA } from "../utils/data";

function SideBar(props) {
  const [userAccess] = useState(getUserAccess());
  const [showIndictaor, setShowIndictaor] = useState(false);
  let ulContainer = null;
  let userData = JSON.parse(localStorage.getItem(USERDATA));

  useEffect(() => {
    if (ulContainer) {
      setShowIndictaor(ulContainer.clientHeight < ulContainer.scrollHeight);
    }
  }, [ulContainer]);

  if (userAccess) {
    return (
      <div className="side-bar">
        <div className="brand">Telecomme</div>
        <ul ref={ref => (ulContainer = ref)}>
          {userAccess.sideBar.dashboard.status && (
            <Link
              to={"/admin"}
              className={props.activeSideBar === "dashboard" ? "active" : ""}
            >
              <div className="side-icon">
                <Level size={"20px"} />
              </div>
              Dashboard
            </Link>
          )}
          {userAccess.sideBar.accounts.status && (
            <Link
              to={"/admin/account"}
              className={props.activeSideBar === "account" ? "active" : ""}
            >
              <div className="side-icon">
                <Group size={"20px"} />
              </div>
              Accounts
            </Link>
          )}
          {userAccess.sideBar.subscribers.status && (
            <Link
              to={"/admin/subscribers"}
              className={props.activeSideBar === "subscribers" ? "active" : ""}
            >
              <div className="side-icon">
                <Icon size={30} name={"ic_supervisor_account"} type={"md"} />
              </div>
              Subscribers
            </Link>
          )}

          {userAccess.sideBar.products.status && (
            <Link
              to={"/admin/services"}
              className={props.activeSideBar === "service" ? "active" : ""}
            >
              <div className="side-icon">
                <File size={"20px"} />
              </div>
              Products
            </Link>
          )}

          {userAccess.sideBar.campaigns.status && (
            <Link
              to={"/admin/campaign"}
              className={props.activeSideBar === "campaign" ? "active" : ""}
            >
              <div className="side-icon">
                <Icon size={30} name={"ic_volume_up"} type={"md"} />
              </div>
              Campaign
            </Link>
          )}

          {userAccess.sideBar.finances.status && (
            <Link
              to={"/admin/finance"}
              className={props.activeSideBar === "finance" ? "active" : ""}
            >
              <div className="side-icon">
                <Icon size={30} name={"barChart2"} type="feather" />
              </div>
              Finance
            </Link>
          )}
          {userAccess.sideBar.support && userAccess.sideBar.support.status && (
            <Link
              to={"/admin/support"}
              className={props.activeSideBar === "support" ? "active" : ""}
            >
              <div className="side-icon">
                <Icon size={30} name="messageCircle" type="feather" />
              </div>
              Support
            </Link>
          )}
          {userAccess.sideBar.settings.status && (
            <Link
              to={"/admin/settings"}
              className={props.activeSideBar === "settings" ? "active" : ""}
            >
              <div className="side-icon">
                <Gear size={"20px"} />
              </div>
              Settings
            </Link>
          )}
          {userAccess.sideBar.profile.status && (
            <Link
              to={`/admin/account/${userData.userId}`}
              className={props.activeSideBar === "account" ? "active" : ""}
            >
              <div className="side-icon">
                <Gear size={"20px"} />
              </div>
              Profile
            </Link>
          )}
        </ul>
        {showIndictaor && (
          <div className="down-indicator">
            <Icon name="chevronDown" type="feather" size={20} />
          </div>
        )}
      </div>
    );
  }
  return <div>''</div>;
}

export default SideBar;
