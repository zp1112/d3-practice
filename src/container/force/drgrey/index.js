import React from "react";
import ForceChart from './force';
import './index.less';

export default class Drgrey extends React.Component {
  componentDidMount () {
    const data = [
      { source: 'cristina', target: 'burke', type: 'cur' },
      { source: 'jackson', target: 'april', type: 'pre' },
      { source: 'jackson', target: 'black woman', type: 'cur' },
      { source: 'april', target: 'maxiu', type: 'cur' },
      { source: 'maxiu', target: 'cristina', type: 'pre' },
    ];
    const sampleData = [
      { source: { name: 'cristina', x: 200, y: 100 }, target: { name: 'burke', x: 300, y: 100 }, type: 'cur',  title: '现任' },
      { source: { name: 'jackson', x: 200, y: 200 }, target: { name: 'april', x: 300, y: 200 }, type: 'pre',  title: '前任' },
    ];
    const chart = new ForceChart(document.getElementById('drgrey'), data, sampleData);
    chart.draw();
    chart.drawSample();
  }
  render() {
    return (<div id="drgrey">
    </div>)
    }
}