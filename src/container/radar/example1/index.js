import React from "react";
import Chart from "./chart";
import './index.less';

export default class RadarExample1 extends React.Component {
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
      { label: "javascript", value: 4 },
      { label: "css", value: 2 },
      { label: "html", value: 5 },
      { label: "d3", value: 7 },
      { label: "echart", value: 4 },
      { label: "python", value: 7 },
    ],
    cur: true,
  };

  componentDidMount() {
      setTimeout(() => {
        const chart = new Chart(document.getElementById("radar-example1"), this.state.data);
        chart.draw(this.state.data)
        this.setState({
            chart,
        })
      }, 0)
  }

  handleClick = () => {
    this.state.chart.draw(this.state.cur ? this.state.data1 : this.state.data);
    this.setState({
        cur: !this.state.cur
    })
  }

  render() {
    return (
      <div id="radar-example1" style={{height: '100%'}}>
      <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
