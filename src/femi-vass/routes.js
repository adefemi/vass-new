import React, { lazy, Suspense } from "react";
import { Route, Redirect, BrowserRouter, Switch } from "react-router-dom";
import { Spinner } from "../components/common/spinner";
import { primaryColor } from "./utils/data";

const Loading = (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
    }}
  >
    <Spinner size={30} color={primaryColor} />
  </div>
);

const LoginView = lazy(() => import("./AdminComponents/login/login"));
const ForgotPassword = lazy(() =>
  import("./AdminComponents/forgotPassword/forgotPassword")
);
const ResetPassword = lazy(() =>
  import("./AdminComponents/forgotPassword/resetPassword")
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/admin" />} />
      <Suspense fallback={Loading}>
        <Route exact path="/login-admin" component={LoginView} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
      </Suspense>
      <Route path="/404" component={() => <div>404 page not found!</div>} />
      <Redirect path="*" exact to="/404" />
    </Switch>
  </BrowserRouter>
);

export default Routes;
