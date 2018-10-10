/** 根路由 * */
import React from "react";
import { Route, Switch, Router } from "react-router-dom";
import { message } from "antd";
import BasicLayout from "./layout";

import history from '../util/history';

/** 普通组件 * */
message.config({
  // 全局提示只显示一秒
  duration: 1,
});
export default class RootContainer extends React.Component {

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" render={props => <BasicLayout {...props} />} />
        </Switch>
      </Router>
    );
  }
}