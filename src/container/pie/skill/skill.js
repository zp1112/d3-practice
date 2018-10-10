import * as d3 from 'd3';

export default class SkillChart {
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
      this.radius = Math.min(this.width, this.height) / 2;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.svg = d3.select(this.el).append('svg').attr('width', this.width).attr('height', this.height);
    }

    initData () {
        const transform = () => {
            return `translate(${this.width / 2}, ${this.height / 2})`
        }
        this.arc = d3.arc().outerRadius(this.radius * 0.7)
        .innerRadius(this.radius * 0.4);
        this.outerArc =  d3.arc().outerRadius(this.radius * 0.8)
        .innerRadius(this.radius * 0.4); // 放大的外围
        this.outerArc1 =  d3.arc().outerRadius(this.radius * 0.9)
        .innerRadius(this.radius * 0.8); // label的外围
        this.pie = d3.pie().sort(null)
        .value(d => d.value);
        this.slices = this.svg.append('g')
        .attr("transform", transform()) // 扇形
        this.labels = this.svg.append('g')
        .attr("transform", transform()) // label
        this.polygons = this.svg.append('g')
        .attr("transform", transform()) // 横线
    }

    change(data) {
        const sum = data.reduce((pre, next) => pre + next.value, 0)
        const that = this;
        this.path = this.slices.selectAll('path').data(this.pie(data), d => d.data.label)
        this.path.enter().insert('path').attr('d', d => this.arc(d)).attr('fill', d => this.color(d.data.label))
        .on('mouseover', function(d) {
            d3.select(this).transition().duration(that.duration).attr('d', d => that.outerArc(d))
            d3.select('body').append('div').attr('class', 'tooltip').html(`${(d.data.value / sum * 100).toFixed(2)}%`).style("left", `${d3.event.pageX}px`)
            .style("top", `${d3.event.pageY}px`)
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(that.duration).attr('d', d => that.arc(d))
            d3.select('.tooltip').remove()
        })
        .each(function(d) {
            this._current = d;
        })
        this.path.transition().duration(1000)
        .attrTween("d", function(d) {
            var interpolate = d3.interpolate(this._current || d, d);
            this._current = interpolate(0);
            return function(t) { 
                return that.arc(interpolate(t));
            };
        })
        this.path.exit().remove();


        this.text = this.labels.selectAll('text').data(this.pie(data), d => d.data.label)
        this.text.enter().append('text').attr('transform', d => 'translate(' + this.outerArc1.centroid(d) + ')')
        .text(d => d.data.label)
        .each(function(d) {
            this._current = d;
        })
        .style('text-anchor', function(d) {
            return midAngle(d) < Math.PI ? 'start' : 'end';
        })
        .attr('transform', function(d) {
            var pos = that.outerArc1.centroid(d);
				pos[0] = that.radius * (midAngle(d) < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
        })
        this.text.transition().duration(1000)
        .attrTween("transform", function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
				var pos = that.outerArc1.centroid(d2);
				pos[0] = that.radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            };
        })
        .styleTween('text-anchor', function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? 'start' : 'end';
            };
        })
        this.text.exit()
        .remove();
        
        
        this.polygon = this.labels.selectAll('polyline').data(this.pie(data), d => d.data.label)
        this.polygon.enter().append('polyline')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', '#000')
        .each(function(d) {
            this._current = d;
        })
        .attr('points', function(d) {
            var pos = that.outerArc1.centroid(d);
            pos[0] = that.radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [that.arc.centroid(d), that.outerArc1.centroid(d), pos];
        })
        this.polygon.transition().duration(1000)
        .attrTween("points", function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
				var pos = that.outerArc1.centroid(d2);
				pos[0] = that.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [that.arc.centroid(d2), that.outerArc1.centroid(d2), pos];
            };
        })
        this.polygon.exit()
        .remove();
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }
    }
}