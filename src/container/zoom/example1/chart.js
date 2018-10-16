import * as d3 from "d3";

const formatDate = d3.timeFormat("%Y-%m-%d");
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
    this.padding = 40;
    this.duration = 300;
    this.radius = Math.min(this.width, this.height) / 3;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.clipID = "clip";
    this.gradientID = "gradient";
    this.startDate = new Date(2000, 0, 1);
    this.endDate = new Date(2010, 0, 1);
    this.scaleTime = d3
      .scaleTime()
      .domain(d3.extent(this.data, d => d.date))
      .rangeRound([0, this.width]);

    this.scaleLinear = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, d => d.price)])
      .range([this.height, 0]);
    this.svg = d3
      .select(this.el)
      .append("svg")
      .attr("width", this.width + this.padding * 2)
      .attr("height", this.height + this.padding * 2)
      .attr(
        "transform",
        `translate(${(this.width + this.padding * 2) / 2}, ${(this.height +
          this.padding * 2) /
          2})`
      );
    this.defs = this.svg.append("defs");
    this.defs
      .append("clipPath")
      .attr("id", this.clipID)
      .append("rect")
      .attr("height", this.height)
      .attr("width", this.width);
    this.gradient = this.defs
      .append("linearGradient")
      .attr("id", this.gradientID)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    this.gradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#931c85" },
        { offset: "180%", color: "#fc3409" }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color); // 渐变
  }

  draw() {
    this.timetickGroup = this.svg
      .append("g")
      .classed("timetick", true)
      .attr(
        "transform",
        "translate(" + this.padding + "," + this.padding + ")"
      );
    this.axisX = d3.axisBottom(this.scaleTime);
    this.axisY = d3.axisLeft(this.scaleLinear);
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 32])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on("zoom", zoomed);
    this.svg.call(this.zoom);
    this.timetickGroup
      .append("g")
      .attr("class", "axis--x")
      .attr("transform", `translate(0, ${this.height})`)
      .call(
        this.axisX.tickSize(20).tickFormat(function(d) {
          return formatDate(d);
        })
      );

    this.timetickGroup
      .append("g")
      .attr("class", "axis--y")
      .call(this.axisY);
    this.area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(d => {
        return this.scaleTime(d.date);
      })
      .y0(this.height)
      .y1(d => {
        return this.scaleLinear(d.price);
      });

    this.timetickGroup
      .append("path")
      .datum(this.data)
      .attr("class", "area")
      .style("fill", `url(#${this.gradientID})`)
      .attr("clip-path", `url(#${this.clipID})`)
      .attr("d", this.area);

    this.line = d3
    .line()
    .curve(d3.curveMonotoneX)
    .defined(d => d.price)
    .x(d => this.scaleTime(d.date))
    .y(d => this.scaleLinear(+d.price));
    const lineGroup = this.timetickGroup
      .append('g')
    lineGroup.append('path')
      .attr('stroke', 'blue')
      .attr('fill', 'none')
      .style("stroke-width","4")
      .attr('d', this.line(this.data));
    lineGroup.append('path')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .style("stroke-dasharray", "3")
      .style("stroke-width","4")
      .attr('d', this.line(this.data.filter(d => d.price !== 0)));

    const that = this;
    function zoomed() {
      var t = d3.event.transform,
        xt = t.rescaleX(that.scaleTime);
      that.timetickGroup.select(".area").attr(
        "d",
        that.area.x(function(d) {
          return xt(d.date);
        })
      );
      that.timetickGroup.select(".axis--x").call(
        that.axisX
          .scale(xt)
          .tickSize(20)
          .tickFormat(function(d) {
            return formatDate(d);
          })
      );
    }
  }
}
