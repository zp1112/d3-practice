import React from "react";
import ReactDOM from "react-dom";
import { LocaleProvider } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import Routers from "./router";

// 公共样式
import "./styles/css.css";
import "./styles/less.less";
import "./styles/scss.scss";

const rootDom = document.getElementById("app-root");
ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Routers />
  </LocaleProvider>,
  rootDom
);

if (module.hot) {
  module.hot.accept();
}
