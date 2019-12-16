import React, { useState, useEffect } from "react";
import "../login/login.css";
import {
  FormGroup,
  Input,
  Button,
  Notification
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import { changePasswordURL, USERTOKEN } from "../../utils/data";
import qs from "query-string";
import _has from "lodash";
import { Link } from "react-router-dom";
import { errorHandler } from "../../../components/utils/helper";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";

function ResetPassword(props) {
  const getActiveToken = () => {
    let query = qs.parse(props.location.search);
    return query.token;
  };

  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [activeToken] = useState(getActiveToken());

  useEffect(() => {
    if (localStorage.getItem(USERTOKEN)) {
      let queryParams = qs.parse(props.location.search);
      if (_has(queryParams, "redirect")) {
        props.history.push(`${queryParams.redirect || "/"}`);
      } else {
        props.history.replace("/");
      }
    } else {
    }
  }, []);

  const onReset = () => {
    if (password !== cPassword) {
      Notification.bubble({
        type: "error",
        content: "Your passwords do not match!"
      });
      return;
    }
    setSubmit(true);

    axiosFunc(
      "post",
      changePasswordURL,
      { password },
      { Authorization: `Bearer ${activeToken}` },
      resetComplete
    );
  };

  const resetComplete = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "You password was changed successfully"
      });
      setTimeout(
        () => (window.location.href = window.location.origin + "/login-admin"),
        500
      );
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  if (!activeToken) {
    return (
      <div className={"login-main"}>
        <div className="content-inner">
          You do not have access to this page!
          <br />
          <Link to={"/login-admin"}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={"login-main"}>
      <div className="content-inner">
        <h3>TELECOMME</h3>
        <p>Set up your new password detail</p>
        <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            onReset();
          }}
        >
          <FormGroup title={"New Password"}>
            <Input
              value={password}
              type="password"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup title={"Confirm Password"}>
            <Input
              value={cPassword}
              type="password"
              required
              onChange={e => setCPassword(e.target.value)}
            />
          </FormGroup>
          <div className={"flex align-c justify-between"}>
            <Button type={"submit"} disabled={submit} loading={submit}>
              Reset
            </Button>
            <Link to={"/login-admin"}>
              <div>Go Home</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
