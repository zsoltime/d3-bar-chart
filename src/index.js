import * as d3 from 'd3';
import 'styles';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

function visualize(data) {
  const margins = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
  };
  const canvasWidth = 800;
  const canvasHeight = 400;
  const height = canvasHeight - margins.top - margins.bottom;
  const width = canvasWidth - margins.left - margins.right;

  // create svg canvas
  const svg = d3.select('#chart')
    .append('svg')
    .attr('class', 'chart')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight)
    .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  // add the tooltip
  const tooltip = d3.select('#chart')
    .append('div')
    .attr('class', 'tooltip');

  // add a linear gradient
  const gradient = svg.append('defs')
    .append('linearGradient')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', '100%')
      .attr('id', 'gradient');

  gradient.append('stop')
    .attr('offset', '15%')
    .attr('stop-color', '#2e7d32');
  gradient.append('stop')
    .attr('offset', '90%')
    .attr('stop-color', '#4caf50');

  // set ranges and scale the range of data
  const scaleX = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d[0])))
    .rangeRound([0, width]);
  const scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[1])])
    .rangeRound([height, 0]);

  // define axes
  const axisX = d3.axisBottom(scaleX)
    .ticks(10);
  const axisY = d3.axisLeft(scaleY)
    .ticks(10);

  const chart = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add x axis
  chart.append('g')
    .attr('class', 'chart__axis chart__axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(axisX)
    .append('text')
      .attr('class', 'chart__label')
      .attr('transform', `translate(${width / 2}, ${margins.bottom / 1.5})`)
      .attr('dy', '0.875em')
      .attr('text-anchor', 'middle')
      .text('Gross Domestic Product, USA (1947 - 2015)');

  // add y axis
  chart.append('g')
    .attr('class', 'chart__axis chart__axis--y')
    .call(axisY)
    .append('text')
      .attr('class', 'chart__label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 10)
      .attr('dy', '0.875em')
      .attr('text-anchor', 'end')
      .text('GDP (USD Billion)');

  // add the bars
  chart.append('g')
    .attr('class', 'chart__bars')
    .selectAll('.chart__bar')
    .data(data)
    .enter()
    .append('rect')
      .attr('class', 'chart__bar')
      .attr('x', d => scaleX(new Date(d[0])))
      .attr('y', d => scaleY(d[1]))
      .attr('width', Math.ceil(width / data.length))
      .attr('height', d => height - scaleY(d[1]))
      .on('mouseover', function onmouseover(d) {
        const dateFormat = d3.timeFormat('%B %Y');
        const currency = d3.format(',.7r');
        const html = `
          <p>${currency(d[1])} Billion</p>
          <p>${dateFormat(new Date(d[0]))}</p>`;

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        tooltip.html(html)
          .style('left', `${d3.mouse(this)[0]}px`)
          .style('top', `${d3.mouse(this)[1] - 32}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      });
}

d3.json(url, (err, { data }) => {
  if (err) throw err;
  visualize(data);
});
