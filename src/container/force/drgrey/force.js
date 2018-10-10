import * as d3 from 'd3';

export default class ForceChart {
    constructor (el, links, sampleData) {
      this.links = links;
      this.sampleData = sampleData;
      this.el = el;
      this.init()
    }
  
    init () {
      this.initVariables()
      this.initData()
    }

    initVariables() {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.duration = 600
      this.padding = 10
      this.svg = d3.select(this.el).append('svg').attr('width', this.width).attr('height', this.height);
    }

    initData () {
      this.nodes = [];
      this.links.forEach(link => {
        if (!this.nodes[link.source]) {
          this.nodes[link.source] = { name: link.source }
        }
        
        if (!this.nodes[link.target]) {
          this.nodes[link.target] = { name: link.target }
        }
      })
      this.nodes = Object.keys(this.nodes).map(row => ({ name: row }))
      console.log(999,this.links)
      console.log(999, this.nodes)
    }

    draw() {
      this.maleColor = d3.scaleOrdinal(d3.schemeCategory10);
      this.color = d3.scaleOrdinal(['green', 'red']);
      const forceLink = d3.forceLink(this.links).id((d) => d.name)
      const simulation = d3.forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody())
      .force('collide', d3.forceCollide().radius(50))
      .force('link', forceLink)
      .force(
        'center',
        d3.forceCenter(600, this.height / 2)
      )
      .on('tick', ticked)
      this.forceContainer = this.svg.append('g');
      const link = this.forceContainer.append('g').selectAll('line').data(this.links).enter().append('line').attr('stroke-width', 2).attr('stroke', (d) => this.color(d.type))
      const node = this.forceContainer.append('g').selectAll('circle').data(this.nodes).enter().append('circle').attr('r', 10).attr('fill', (d) => this.maleColor(d.name))
      .call(d3.drag()
           .on('start', dragstarted)
           .on('drag', dragged)
           .on('end', dragended));
      const text = this.forceContainer.append('g').selectAll('text').data(this.nodes).enter().append('text').text(d => d.name).attr("dx", 12)
      .attr("dy", '.31em');
      node.append('title')
    .text(d => d.name);
      function ticked() {
        link
          .attr("x1",d => d.source.x)
          .attr("y1",d => d.source.y)
          .attr("x2",d => d.target.x)
          .attr("y2",d => d.target.y);

        node
          .attr("cx",d => d.x)
          .attr("cy",d => d.y);
        text
          .attr("x",d => d.x)
          .attr("y",d => d.y);
      }
      
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }

    drawSample() {
      this.svg.append('g').selectAll('line').data(this.sampleData)
      .enter().append('line').attr('stroke-width', 2).attr('stroke', (d) => this.color(d.type))
      .attr("x1",d => d.source.x)
      .attr("y1",d => d.source.y)
      .attr("x2",d => d.target.x)
      .attr("y2",d => d.target.y);
      this.svg.append('g').selectAll('text').data(this.sampleData)
      .enter().append('text').text(d => d.title)
      .attr('x', d => d.source.x)
      .attr('y', d => d.source.y)
      .attr('text-anchor', 'end')
      .attr('dx', -12)
      .attr('dy', '.31em')
    }
}