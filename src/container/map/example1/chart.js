import * as d3 from 'd3';

export default class Chart {
    constructor (el, data) {
      this.data = data;
      this.el = el;
      this.init()
    }
  
    init () {
      this.initVariables()
      this.initData()
    }

    initVariables() {
      this.width = 960
      this.height = 450
      this.duration = 300
      this.padding = 20;
      this.radius = Math.min(this.width, this.height) / 2;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.svg = d3.select(this.el).append('svg').attr('transform', `translate(${this.padding}, ${this.padding})`);
    }

    initData () {
        const transform = () => {
            return `translate(${this.width / 2}, ${this.height / 2})`
        }
    }

    draw(data) {
    }
}