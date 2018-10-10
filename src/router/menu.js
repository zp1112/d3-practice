/** 左侧导航 * */
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import c from "classnames";
import _ from "lodash";
import css from "./menu.scss";

const { Sider } = Layout;
const { SubMenu, Item } = Menu;
export default class MyMenu extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            treeDom: [], // 生成的菜单结构
            chosedKey: [], // 当前选中
            openKeys: [], // 当前需要被展开的项
        };
    }

    componentDidMount() {
        const data = [
            { name: '力导图', page_name: 'force', children: [{
                name: '实习医生格蕾关系', page_name: 'drgrey',
            }]},
            {name: '饼图', page_name: 'pie', children: [{
                name: '技术能力分布', page_name: 'skill',
            }]},
            {name: '雷达图', page_name: 'radar', children: [{
                name: '技术能力分布', page_name: 'example1',
            }]},
            {name: '测试', page_name: 'test', children: [{
                name: 'react新特性', page_name: 'new',
            }]},
        ]
        this.makeSourceData(data);
        this.nowChosed(this.props.location);
    }

    componentWillReceiveProps(nextP) {
        if (this.props.location !== nextP.location) {
            this.nowChosed(nextP.location);
        }
    }

    /** 菜单展开和关闭时触发 * */
    onOpenChange(keys) {
        this.setState({
            openKeys: keys,
        });
    }

    /** 处理当前选中 * */
    nowChosed(location) {
        const paths = location.pathname.split("/").filter(item => !!item);
        this.setState({
            chosedKey: [location.pathname],
            openKeys: paths.map(item => `/${item}`),
        });
    }

    /** 处理原始数据，将原始数据处理为层级关系 * */
    makeSourceData(data) {
        const d = _.cloneDeep(data);
        // 按照sort排序
        d.sort((a, b) => {
            return a.sorts - b.sorts;
        });
        const treeDom = this.makeTreeDom(d, "");
        this.setState({
            treeDom,
        });
    }

    /** 构建树结构 * */
    makeTreeDom(data, key) {
        return data.map(item => {
            const newKey = `${key}/${item.page_name}`;
            if (item.children) {
                return (
                  <SubMenu
                    key={newKey}
                    title={item.name}
                  >
                    {this.makeTreeDom(item.children, newKey)}
                  </SubMenu>
                );
            } else {
                return (
                  <Item key={newKey}>
                    <Link to={newKey}>
                      <span>{item.name}</span>
                    </Link>
                  </Item>
                );
            }
        });
    }

    render() {
        return (
          <Sider
            width={256}
            className={css.sider}
            trigger={null}
            collapsible
            collapsed={this.props.collapsed}
          >
            <div
              className={
                        this.props.collapsed
                            ? c(css.menuLogo, css.hide)
                            : css.menuLogo
                    }
            >
              <Link to="/">
                <div>d3例子集合</div>
              </Link>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={this.state.chosedKey}
              {...(this.props.collapsed
                        ? {}
                        : { openKeys: this.state.openKeys })}
              onOpenChange={e => this.onOpenChange(e)}
            >
              {this.state.treeDom}
            </Menu>
          </Sider>
        );
    }
}
