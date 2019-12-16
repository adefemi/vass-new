import React from "react";
import ReactDOM from "react-dom";
import Routes from "./femi-vass/routes";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/admin" />} />
      <Routes />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
