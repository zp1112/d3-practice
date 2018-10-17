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
      .range([0, this.width]);

    this.scaleLinear = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, d => d.price)])
      .range([this.height, 0]);
      this.container = d3
      .select(this.el)
        .append('div')
        // .attr("width", this.width + this.padding * 2)
        .attr("height", this.height + this.padding * 2)
        this.container.style(
          "transform",
          `translate(${(this.width + this.padding * 2) / 2}px, ${(this.height +
            this.padding * 2) /
            2}px)`
            );
    this.svg = this.container
      .append("svg")
      .attr("width", this.width + this.padding * 2)
      .attr("height", this.height + this.padding * 2)
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
    this.timetickGroup.append("path")
      .datum(this.data)
      .attr("class", "area")
      .attr("id", "area")
      .style("fill", `url(#${this.gradientID})`)
      .attr("clip-path", `url(#${this.clipID})`)
      .attr("d", this.area)
      .on("mouseover mousemove touchstart touchmove", hoverMouseOn);
      this.timetickGroup
      .append("line")
      .attr("class", "topline")
      .attr('stroke', 'black')
      .attr('stroke-width', 5)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", this.width)
      .attr("y2", 0);
    // arearect.on("mouseover mousemove touchstart touchmove", hoverMouseOn);
      const polygon = this.timetickGroup
      .append("g")
      .attr("class", "focusgroup");
      polygon.append('polygon')
			.attr("points", "0,0 16,0 8,4")
			.style("fill", "#385e69")
			.style("stroke", "#385e69");
      polygon.append('line')
      .attr("x1", 8)
      .attr("y1", 0)
      .attr("x2", 8)
      .attr("y2", this.height)
			.style("fill", "#385e69")
      .style("stroke", "#385e69");

      this.tooltip = this.container
      .append("div").attr('class', 'tooltip')
      function hoverMouseOn() {
        $('.tooltip').hide()
        const mouse_x = d3.mouse(this)[0];
        const xPostion = (that.t ? that.t.rescaleX(that.scaleTime) : that.scaleTime).invert(mouse_x);
        const focueGroup = d3.select('.focusgroup');
        const focusGroupWidth = 16;
        focueGroup.attr("transform", "translate(" + (mouse_x - focusGroupWidth * 0.5) + "," + 0 + ")");
        d3.select('.tooltip').html(that.data.find(d => formatDate(d.date) === formatDate(xPostion)) ? that.data.find(d => formatDate(d.date) === formatDate(xPostion)).price : '无数据')
        d3.select('.tooltip').style('transform', `translate(${that.padding}px, ${that.padding}px)`).style('left', mouse_x + 'px').style('top', '30px')
        $('.tooltip').show();
      }

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
      .attr('class', 'topline')
      .attr('fill', 'none')
      .style("stroke-width","4")
      .attr("clip-path", `url(#${this.clipID})`)
      .attr('d', this.line(this.data));
    lineGroup.append('path')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('class', 'topline1')
      .style("stroke-dasharray", "3")
      .style("stroke-width","4")
      .attr("clip-path", `url(#${this.clipID})`)
      .attr('d', this.line(this.data.filter(d => d.price !== 0)));

    const that = this;
    function zoomed() {
      var t = d3.event.transform,
        xt = t.rescaleX(that.scaleTime);
        that.translatex = t.x;
        that.t = t;
      that.timetickGroup.select(".area").attr(
        "d",
        that.area.x(function(d) {
          return xt(d.date);
        })
      );
      that.timetickGroup.selectAll(".topline").attr(
        "d",
        that.line.x(function(d) {
          return xt(d.date);
        })(that.data)
      );
      that.timetickGroup.selectAll(".topline1").attr(
        "d",
        that.line.x(function(d) {
          return xt(d.date);
        })(that.data.filter(d => d.price !== 0))
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
