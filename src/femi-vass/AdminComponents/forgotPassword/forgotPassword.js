import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Input,
  Button,
  Notification
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import { resetPasswordURL, USERTOKEN } from "../../utils/data";
import qs from "query-string";
import _has from "lodash";
import { Link } from "react-router-dom";
import { errorHandler } from "../../../components/utils/helper";

function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState(false);

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
    setSubmit(true);
    axiosFunc(
      "get",
      resetPasswordURL(email, `${window.location.origin}/reset-password`),
      null,
      null,
      resetComplete
    );
  };

  const resetComplete = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content:
          "Reset Successful, A reset link as been sent to the provided email address"
      });
    } else {
    }
  };

  return (
    <div className={"login-main"}>
      <div className="content-inner">
        <h3>TELECOMME</h3>
        <p>Provide your registration email to reset password </p>
        <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            onReset();
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
          <div className={"flex align-c justify-between"}>
            <Button type={"submit"} disabled={submit} loading={submit}>
              Reset
            </Button>
            <Link to={"/login-admin"}>
              <div>Go Back</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
