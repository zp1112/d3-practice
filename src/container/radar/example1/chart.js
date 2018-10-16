import * as d3 from "d3";

export default class Chart {
  constructor(el, data) {
    this.data = data;
    this.el = el;
    this.init();
  }

  init() {
    this.initVariables();
    this.updateVariables();
    this.initData();
  }

  initVariables() {
    this.width = this.el.offsetWidth / 2;
    this.height = this.el.offsetHeight / 2;
    this.duration = 300;
    this.radius = Math.min(this.width, this.height) / 3;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.scaleLinear = d3
      .scaleLinear()
      .domain([0, Math.max(...this.data.map(row => row.value)) * 1.2])
      .range([0, this.radius]);
    this.level = 4;
    this.total = this.data.length;
    this.perAngle = (2 * Math.PI) / this.total;

    this.svg = d3
      .select(this.el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
  }

  updateVariables() {
    this.scaleLinear = d3
      .scaleLinear()
      .domain([0, Math.max(...this.data.map(row => row.value)) * 1.2])
      .range([0, this.radius]);
    this.total = this.data.length;
    this.perAngle = (2 * Math.PI) / this.total;
    this.realPoints = new Array(this.total).fill().map((row, index) => {
      const angle = this.perAngle * (index + 1);
      return [
        Math.cos(angle) * this.data[index].value,
        Math.sin(angle) * this.data[index].value
      ];
    });
    this.realPoints = this.realPoints.map(row => [
      this.scaleLinear(row[0]),
      this.scaleLinear(row[1])
    ]);
  }

  initData() {
    const transform = () => {
      return `translate(${this.width / 2}, ${this.height / 2})`;
    };
    this.polygons = this.svg.append("g").attr("transform", transform()); // 背景多边形

    this.lines = this.svg.append("g").attr("transform", transform()); // 背景对角线

    this.innerPolygons = this.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .attr("transform", transform()); // 实际多边形
    this.gradientCircle = this.svg
      .append("circle")
      .attr("cx", this.width / 2)
      .attr("cy", this.height / 2)
      .attr("r", this.radius); // 渐变圆形

    this.innerPolygonsPoints = this.svg
      .append("g")
      .attr("transform", transform()); // 圆点

    this.innerPolygonsLabels = this.svg
      .append("g")
      .attr("transform", transform()); // 文字

    this.darwBack();

    const defs = this.svg.append("defs");
    this.radialGradient = defs
      .append("radialGradient")
      .attr("id", "radial-gradient")
      .attr("r", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#fff" },
        { offset: "48%", color: "#fc3409" },
        { offset: "180%", color: "#931c85" }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color); // 渐变
  }

  darwBack() {
    const linePoints = new Array(this.total).fill().map((row, index) => {
      const angle = this.perAngle * (index + 1);
      return [Math.cos(angle) * this.radius, Math.sin(angle) * this.radius];
    });
    // 画对角线
    for (const item of linePoints) {
      this.lines
        .append("line")
        .attr("class", "line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", item[0])
        .attr("y2", item[1]);
    }
    const labelPoints = new Array(this.total).fill().map((row, index) => {
      const angle = this.perAngle * (index + 1);
      return [Math.cos(angle) * (this.radius + 20), Math.sin(angle) * (this.radius + 20)];
    });
    this.innerPolygonsLabel = this.innerPolygonsLabels
      .selectAll("text")
      .data(this.data);
    const that = this;
    this.innerPolygonsLabel
      .enter()
      .append("text")
      .attr("class", "real-polygon-text")
      .text(d => d.label)
      .each(function(_, i) {
        d3.select(this)
        .attr("x", labelPoints[i][0])
        .attr("y", labelPoints[i][1])
        .style('text-anchor', ((that.perAngle * (i + 1) > Math.PI / 2) && (that.perAngle * (i + 1) < Math.PI * 3 / 2)) ? 'end' : 'start')
      });
    let points = [];
    for (let i = this.level; i > 0; i--) {
      // 画多边形
      const radius = (this.radius * i) / this.level;
      points = new Array(this.total).fill().map((row, index) => {
        const angle = this.perAngle * (index + 1);
        return [Math.cos(angle) * radius, Math.sin(angle) * radius];
      });
      this.polygons
        .append("polygon")
        .attr("class", "polygon")
        .attr("points", points);
      this.polygons.exit().remove();
    }
  }

  draw(data) {
    this.data = data;
    this.updateVariables();
    this.gradientCircle
      .style("fill", "url(#radial-gradient)")
      .attr("clip-path", "url(#clip)");
    // 画数据
    this.innerPolygonsPoints.append('use').attr('xlink:href', '#clip-polygon')
    this.innerPolygon = this.innerPolygons.selectAll("polygon").data([0]);

    this.innerPolygon
      .enter()
      .append("polygon")
      .attr("class", "real-polygon")
      .attr('id', 'clip-polygon')
      .attr('stroke-width', 4)
      .attr("points", this.realPoints);

    this.innerPolygon
      .transition()
      .duration(this.duration)
      .attr("points", this.realPoints);


    // 画点
    this.innerPolygonsPoint = this.innerPolygonsPoints
      .selectAll("circle")
      .data(this.realPoints);
    this.innerPolygonsPoint
      .enter()
      .append("circle")
      .attr("class", "real-polygon-point")
      .attr("r", 4)
      .attr("cx", d => d[0])
      .attr("cy", d => d[1]);

    this.innerPolygonsPoint
      .transition()
      .duration(this.duration)
      .attr("cx", d => d[0])
      .attr("cy", d => d[1]);
  }
}
