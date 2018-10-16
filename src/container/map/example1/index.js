import React from "react";
import Chart from "./chart";
import "./index.less";

export default class Map1 extends React.Component {
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
    const chart = new Chart(document.getElementById("map1"));
    this.setState({
      chart
    });
    chart.draw(this.state.data);
  }

  handleClick = () => {
    this.state.chart.change(
      this.state.cur ? this.state.data1 : this.state.data
    );
    this.setState({
      cur: !this.state.cur
    });
  };

  render() {
    return (
      <div id="map1">
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
