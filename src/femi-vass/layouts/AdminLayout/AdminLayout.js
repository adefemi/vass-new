import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./AdminLayout.css";
import NavBar from "../../partials/NavBar";
import SideBar from "../../partials/SideBar";
import { USERDATA } from "../../utils/data";
import { withRouter } from "react-router-dom";
import "../../style/default.css";
import "../../AdminComponents/settings/Setting.css";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";

function AdminLayout(props) {
  const [userType, setUserType] = useState("admin");
  const [activeSideBar, setActiveSideBar] = useState("dashboard");
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem(USERDATA));
    if (userData && userData.role.toLowerCase() === "admin") {
      setUserType("admin");
    } else {
      setUserType("user");
    }
    let pathnameArray = props.history.location.pathname.split("/");
    if (
      pathnameArray.includes("subscribers") ||
      pathnameArray.includes("subscriber")
    ) {
      setActiveSideBar("subscribers");
    } else if (
      pathnameArray.includes("account") ||
      pathnameArray.includes("accounts")
    ) {
      setActiveSideBar("account");
    } else if (
      pathnameArray.includes("services") ||
      pathnameArray.includes("service")
    ) {
      setActiveSideBar("service");
    } else if (
      pathnameArray.includes("campaign") ||
      pathnameArray.includes("campaigns")
    ) {
      setActiveSideBar("campaign");
    } else if (
      pathnameArray.includes("finance") ||
      pathnameArray.includes("finances")
    ) {
      setActiveSideBar("finance");
    } else if (
      pathnameArray.includes("settings") ||
      pathnameArray.includes("setting")
    ) {
      setActiveSideBar("settings");
    } else if (pathnameArray.includes("support")) {
      setActiveSideBar("support");
    } else {
      setActiveSideBar("dashboard");
    }
  }, [props]);

  return (
    <div className="layout-main">
      <NavBar {...props} />

      <SideBar {...props} activeSideBar={activeSideBar} />
      <div className={`content-main ${!props.navbar && "no-header"}`}>
        {props.children}
      </div>
    </div>
  );
}

AdminLayout.defaultProps = {
  navbar: true,
  activeSideBar: ""
};

AdminLayout.propTypes = {
  navbar: PropTypes.bool,
  activeSideBar: PropTypes.string
};

export default withRouter(AdminLayout);
