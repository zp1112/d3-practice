import React from "react";
import SkillChart from "./skill";
import './index.less';

export default class Skill extends React.Component {
  state = {
    data: [
      { label: "javascript", value: 8 },
      { label: "css", value: 7 },
      { label: "html", value: 8 },
      { label: "d3", value: 3 },
      { label: "echart", value: 4 },
      { label: "python", value: 1 }
    ],
    data1: [
      { label: "javascript", value: 1 },
      { label: "css", value: 3 },
      { label: "html", value: 5 },
      { label: "d3", value: 3 },
      { label: "echart", value: 4 },
      { label: "python", value: 1 }
    ],
    cur: true,
  };

  componentDidMount() {
    const chart = new SkillChart(document.getElementById("skill"));
    this.setState({
      chart,
    });
    // chart.change(this.state.data);
    chart.change(this.state.data);
  }

  handleClick = () => {
    this.state.chart.change(
      this.state.cur ? this.state.data1 : this.state.data
    );
    this.setState({
      cur: !this.state.cur,
    });
  };

  render() {
    return (
      <div id="skill">
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
