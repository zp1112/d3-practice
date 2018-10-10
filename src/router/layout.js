/** 基础页面结构 - 有头部，有底部，有侧边导航 * */

// ==================
// 必需的各种插件
// ==================
import React from "react";
import { Layout } from "antd";
import { Route, Switch, Redirect } from "react-router-dom";

import lazyNotFound from "../container/ErrorPages/404";
import DrGrey from '../container/force/drgrey';
import PieSkill from '../container/pie/skill';
import TestNew from '../container/test/new';
import Radar1 from '../container/radar/example1';

// ==================
// 所需的所有组件
// ==================
import MyMenu from "./menu";
import css from "./layout.scss";

const NotFound = lazyNotFound;
// ==================
// Class
// ==================
const { Content } = Layout;
export default class BasicLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectUrl: '/force/drgrey',
      collapsed: false, // 侧边栏是否收起
    };
  }


  /** 点击切换菜单状态 * */
  onToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout className={css.page}>
        <MyMenu
          collapsed={this.state.collapsed}
          location={this.props.location}
        />
        <Layout>
          <Content className={css.content}>
            <Switch>
              <Redirect exact from="/" to={this.state.redirectUrl} />
              <Route
                exact
                path="/force/drgrey"
                render={(props) => <DrGrey {...props} />}
              />
              <Route
                exact
                path="/pie/skill"
                render={(props) => <PieSkill {...props} />}
              />
              <Route
                exact
                path="/radar/example1"
                render={(props) => <Radar1 {...props} />}
              />
              <Route
                exact
                path="/test/new"
                render={(props) => <TestNew {...props} />}
              />
              <Route component={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}