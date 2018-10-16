import React from "react";
import * as d3 from "d3";
import Chart from "./chart";
import "./index.less";


const parseDate = d3.timeParse("%b %Y");
const data = require('./data.csv');
export default class ZoomExample1 extends React.Component {
  state = {};

  componentDidMount() {
    setTimeout(() => {
        const chart = new Chart(document.getElementById("zoom-example1"), data.map(d => {
            d.date = parseDate(d.date)
          d.price = +d.price;
          return d;
        }));
        chart.draw();
        this.setState({
          chart
        });
    }, 0);
  }

  handleClick = () => {};

  render() {
    return (
      <div id="zoom-example1" style={{ height: "100%" }}>
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
