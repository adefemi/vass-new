import React, { useState, useEffect } from "react";
import {
  Icon,
  DropDown,
  Notification,
  Spinner,
  Card
} from "../../components/common";
import "./NavBar.css";
import {
  USERTOKEN,
  USERDATA,
  secondaryColor,
  primaryColor,
  USERACCESSCONTROL,
  walletTotalUrl,
  auditUrl
} from "../utils/data";
import { withRouter } from "react-router-dom";
import { errorHandler } from "../../components/utils/helper";
import { axiosFunc, formatCurrency } from "../utils/helper";
import { Link } from "react-router-dom";
import Badge from "antd/lib/badge";

export const logout = () => {
  localStorage.removeItem(USERTOKEN);
  localStorage.removeItem(USERDATA);
  localStorage.removeItem(USERACCESSCONTROL);
  window.location.href = window.location.origin + "/login-admin";
};

function NavBar(props) {
  const [earnings, setEarnings] = useState({ content: [], fetching: true });
  const [searchDrop, setSearchDrop] = useState(false);
  const [userData, setUserData] = useState(null);
  const [audits, setAudits] = useState(0);

  const onFetchData = (status, payload) => {
    if (status) {
      setEarnings({
        content: payload.data.data,
        fetching: false
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const getAudits = () => {
    axiosFunc(
      "get",
      auditUrl(`?type=unread&dataType=count`),
      null,
      "yes",
      (status, payload) => {
        if (status) {
          setAudits(payload.data.data);
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(payload)
          });
        }
      }
    );
  };

  useEffect(() => {
    axiosFunc(
      "get",
      walletTotalUrl("?recordType=total"),
      null,
      "yes",
      onFetchData
    );
    getAudits();
    if (localStorage.getItem(USERDATA)) {
      setUserData(JSON.parse(localStorage.getItem(USERDATA)));
    }
  }, []);

  const navProfile = () => {
    let userRole = userData.role;
    if (userRole.toLowerCase() === "admin") {
      props.history.push("/admin/settings");
    } else {
      props.history.push(`/admin/account/${userData.userId}`);
    }
  };

  return (
    <div className="nav-bar">
      <div className="nav-right">
        <div
          className="heading-content flex align-c"
          style={{ padding: "0 20px" }}
        >
          <Link to={"/admin/finance"}>
            <div
              onClick={() => props.history.push("/admin/finance")}
              style={{ cursor: "pointer" }}
            >
              <span style={{ marginBottom: "10px" }}>EARNINGS</span>
              <div className="font-size-small">
                <span style={{ color: secondaryColor }}>Total:</span>{" "}
                <strong style={{ color: secondaryColor }}>
                  &#8358;
                  {earnings.fetching ? (
                    <Spinner color={secondaryColor} />
                  ) : earnings.content.length < 1 ? (
                    0.0
                  ) : (
                    formatCurrency(earnings.content.balance) || 0
                  )}
                </strong>
                &nbsp;&nbsp;&nbsp;
                <span style={{ color: primaryColor }}>Payable:</span>{" "}
                <strong style={{ color: primaryColor }}>
                  &#8358;
                  {earnings.fetching ? (
                    <Spinner color={secondaryColor} />
                  ) : earnings.content.length < 1 ? (
                    0.0
                  ) : (
                    formatCurrency(earnings.content.payable) || 0
                  )}
                </strong>
                &nbsp;&nbsp;&nbsp;
                <span style={{ color: "#e67e22" }}>Promo:</span>{" "}
                <strong style={{ color: "#e67e22" }}>
                  &#8358;
                  {earnings.fetching ? (
                    <Spinner color={"#e67e22"} />
                  ) : earnings.content.length < 1 ? (
                    0.0
                  ) : (
                    formatCurrency(earnings.content.promoBalance) || 0
                  )}
                </strong>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="nav-left">
        <span
          className="link"
          onClick={() => {
            setAudits(0);
            setTimeout(() => props.history.push("/admin/audits"), 200);
          }}
        >
          <Badge count={audits}>
            <Icon name={"bell"} type={"feather"} />
          </Badge>
        </span>
        <DropDown
          active={""}
          onChange={() => null}
          staticContent={true}
          static={true}
          dropDownWidth={"150px"}
          options={[
            {
              content: (
                <span className={"nav-item-drop "} onClick={navProfile}>
                  <Icon name={"user"} type={"feather"} /> Profile
                </span>
              )
            },
            {
              content: (
                <span
                  className={"nav-item-drop danger"}
                  onClick={() => logout()}
                >
                  <Icon name={"logOut"} type={"feather"} /> Log out
                </span>
              )
            }
          ]}
        >
          {userData && (
            <div className="user-profile">
              <div className={"user-label"}>
                {userData.role.toLowerCase() === "admin"
                  ? "Admin"
                  : userData.email}
              </div>
              <div className="image-con">
                <img src="" alt="" />
              </div>
            </div>
          )}
        </DropDown>
      </div>
      <Card className={searchDrop ? "search-drop show" : "search-drop"}>
        <div className="padding-20">
          <span className="close" onClick={() => setSearchDrop(false)}>
            <Icon name="x" type="feather" />
          </span>

          <div>
            User Info
            <div className="divider" />
            <br />
            Name: Firstname Lastname Phone: 9828990290290
            <br />
            <br />
            Billings
            <div className="divider" />
            <br />
            <br />
            <br />
            Subscriptions
            <div className="divider" />
            <br />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(NavBar);
