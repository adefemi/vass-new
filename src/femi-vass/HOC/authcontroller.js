import React, { useEffect } from "react";

import {
  USERTOKEN,
  USERDATA,
  productUrl,
  USERACCESSCONTROL
} from "../utils/data";
import { axiosFunc } from "../utils/helper";

const AuthController = component => {
  const Authenticate = props => {
    const RenderComponent = props.component;

    const onFetchData = (status, payload) => {
      if (!status) {
        props.history.push(`/login-admin?redirect=${props.location.pathname}`);

        return null;
      }
    };

    useEffect(() => {
      try {
        const token = localStorage.getItem(USERTOKEN);
        if (token) {
          axiosFunc(
            "get",
            productUrl(),
            null,
            {
              Authorization: `Bearer ${localStorage.getItem(USERTOKEN)}`
            },
            onFetchData
          );
        } else {
          localStorage.removeItem(USERTOKEN);
          localStorage.removeItem(USERDATA);
          localStorage.removeItem(USERACCESSCONTROL);
          props.history.push(
            `/login-admin?redirect=${encodeURIComponent(
              props.location.pathname
            )}`
          );
        }
      } catch (e) {
        props.history.push(
          `/login-admin?redirect=${encodeURIComponent(props.location.pathname)}`
        );
      }
    }, [RenderComponent]);

    return <RenderComponent {...props} />;
  };

  Authenticate.defaultProps = {
    component
  };
  return Authenticate;
};

export default AuthController;
