import * as d3 from "d3";

export default class Chart {
  constructor(el, data) {
    this.data = data;
    this.el = el;
    this.init();
  }

  init() {
    this.initVariables();
  }

  initVariables() {
    this.width = this.el.offsetWidth / 2;
    this.height = this.el.offsetHeight / 2;
    this.padding = 20;
    this.duration = 300;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.xScale = d3
      .scaleBand()
      .domain(this.data.map(row => row.label))
      .range([0, this.width - this.padding * 2]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...this.data.map(row => row.value))])
      .range([this.height - this.padding * 2, 0]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.yInner = d3.axisLeft(this.yScale).ticks(8);
    this.xInner = d3.axisBottom(this.xScale).ticks(this.data.length);

    this.svg = d3
      .select(this.el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
      .append("g")
      .attr("transform", `translate(${this.padding}, ${this.padding})`);
    this.drawAxis();

    this.bubles = this.svg.append("g");
  }

  transform() {
    return `translate(${this.width / 2}, ${this.height / 2})`;
  }

  drawAxis() {
    this.svg
      .append("g")
      .call(this.xAxis)
      .attr("transform", `translate(0, ${this.height - this.padding * 2})`);
    this.svg.append("g").call(this.yAxis);
    this.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("ssss")
      .attr("dy", "1em");
    this.svg.append('g').attr('class', 'grid').call(this.yInner.tickFormat("").tickSize(-(this.width - this.padding * 2)))
    this.svg.append('g').attr('class', 'grid').call(this.xInner.tickFormat("").tickSize(-(this.height - this.padding * 2))).attr('transform', `translate(0, ${this.height - this.padding * 2})`)
  }

  draw(data) {
    this.data = data;

    this.bubbel = this.bubles.selectAll("circle").data(this.data);
    this.bubbel
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("cx", d => this.xScale(d.label) + this.xScale.bandwidth() / 2)
      .attr("cy", d => this.yScale(d.value))
      .attr("class", "bubble")
      .each(function() {
          const that = this;
          d3.interval(function() {
            d3.select(that).transition().duration(600).attr('r', 10).transition().duration(600).attr('r', 20)
          }, 1000)
      })
    this.bubbel
      .transition()
      .duration(this.duration)
      .attr("cx", d => this.xScale(d.label) + this.xScale.bandwidth() / 2)
      .attr("cy", d => this.yScale(d.value));
  }
}
