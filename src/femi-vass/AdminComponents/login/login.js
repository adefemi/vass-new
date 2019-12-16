import React, { useState, useEffect } from "react";
import "./login.css";
import {
  FormGroup,
  Input,
  Button,
  Notification
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import {
  loginUrl,
  USERACCESSCONTROL,
  USERDATA,
  USERTOKEN,
  userUrl
} from "../../utils/data";
import qs from "query-string";
import { Link } from "react-router-dom";
import _has from "lodash";
import {
  AdminAccessControl,
  ServiceProviderAccessControl
} from "../../utils/access_control";
import "../../style/default.css";
import "../settings/Setting.css";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(USERTOKEN)) {
      let queryParams = qs.parse(props.location.search);
      if (_has(queryParams, "redirect")) {
        props.history.push(`${queryParams.redirect || "/"}`);
      } else {
        props.history.replace("/");
      }
    }
  }, []);

  const onLogin = () => {
    setSubmit(true);
    axiosFunc("post", loginUrl, { email, password }, null, loginComplete);
  };

  const gotoSystem = () => {
    let queryParams = qs.parse(props.location.search);
    if (_has(queryParams, "redirect")) {
      props.history.push(`${queryParams.redirect || "/"}`);
    } else {
      props.history.push("/admin");
    }
    setSubmit(false);
  };

  const loginComplete = (status, payload) => {
    if (status) {
      let activeData = payload.data.data;
      localStorage.setItem(USERTOKEN, activeData.token);
      localStorage.setItem(USERDATA, JSON.stringify(activeData.user));

      if (payload.data.data.user.role.toLowerCase() === "admin") {
        localStorage.setItem(
          USERACCESSCONTROL,
          JSON.stringify(AdminAccessControl)
        );
        gotoSystem();
      } else {
        if (activeData.user.profile.roleId) {
          axiosFunc(
            "get",
            userUrl(`roles?roleId=${activeData.user.profile.roleId}`),
            null,
            "yes",
            (status, data) => {
              if (status) {
                localStorage.setItem(
                  USERACCESSCONTROL,
                  JSON.stringify(data.data.data.accessControl)
                );
                gotoSystem();
              } else {
                Notification.bubble({
                  type: "error",
                  content: "An error occurred while getting role information"
                });
                setSubmit(false);
              }
            }
          );
        } else {
          localStorage.setItem(
            USERACCESSCONTROL,
            JSON.stringify(ServiceProviderAccessControl)
          );
          gotoSystem();
        }
      }
    } else {
      Notification.bubble({
        type: "error",
        content: "Invalid username or password"
      });
      setSubmit(false);
    }
  };

  return (
    <div className={"login-main"}>
      <div className="content-inner">
        <h3>TELECOMME</h3>
        <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            onLogin();
          }}
        >
          <FormGroup title={"Email Address"}>
            <Input
              value={email}
              type={"email"}
              required
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup title={"Password"}>
            <Input
              type={"password"}
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />
          </FormGroup>
          <div className={"flex align-c justify-between"}>
            <Button type={"submit"} disabled={submit} loading={submit}>
              Login
            </Button>
            <Link to={"/forgot-password"}>
              <div>forgot password?</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
