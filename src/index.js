import { axisBottom, axisLeft } from 'd3-axis';
import { mouse, select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent, max } from 'd3-array';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { json } from 'd3-request';
import { easeBack } from 'd3-ease';
import 'd3-transition';
import 'styles';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

function visualize(data) {
  const margins = {
    top: 5,
    right: 10,
    bottom: 80,
    left: 40,
  };
  const canvasWidth = 800;
  const canvasHeight = 450;
  const height = canvasHeight - margins.top - margins.bottom;
  const width = canvasWidth - margins.left - margins.right;

  // create svg canvas
  const svg = select('#chart')
    .append('svg')
      .attr('class', 'chart')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  // add the tooltip
  const tooltip = select('#chart')
    .append('div')
      .attr('class', 'tooltip');

  // add linear gradients
  const gradients = [{
    id: 'green',
    from: '#2e7d32',
    to: '#4caf50',
  }, {
    id: 'red',
    from: 'crimson',
    to: 'tomato',
  }, {
    id: 'blue',
    from: 'steelblue',
    to: 'lightseagreen',
  }];

  gradients.forEach((gradient, i) => {
    const g = svg.append('defs')
      .append('linearGradient')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', '100%')
        .attr('id', `gradient-${gradient.id}`);

    g.append('stop')
      .attr('offset', '15%')
      .attr('stop-color', gradient.from);
    g.append('stop')
      .attr('offset', '90%')
      .attr('stop-color', gradient.to);

    svg.append('circle')
      .attr('class', 'selector')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 16)
      .style(
        'transform',
        `translate(${60 + (i * 40)}px, ${canvasHeight - 24}px) rotate(-30deg)`
      )
      .attr('fill', `url(#gradient-${gradient.id})`)
      .on('click', () => {
        svg.selectAll('.chart__bar')
          .style('fill', `url(#gradient-${gradient.id})`);
      });
  });

  // set ranges and scale the range of data
  const scaleX = scaleTime()
    .domain(extent(data, d => new Date(d[0])))
    .rangeRound([0, width]);
  const scaleY = scaleLinear()
    .domain([0, max(data, d => d[1])])
    .rangeRound([height, 0]);

  // define axes
  const axisX = axisBottom(scaleX)
    .ticks(10);
  const axisY = axisLeft(scaleY)
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
      .attr('y', () => height)
      .attr('width', Math.ceil(width / data.length))
      .attr('height', 0)
      .transition()
      .ease(easeBack)
      .duration(1000)
      .delay((d, i) => i * 2)
      .attr('y', d => scaleY(d[1]))
      .attr('height', d => height - scaleY(d[1]));

  chart.selectAll('rect')
    .on('mouseover', (d) => {
      const dateFormat = timeFormat('%B %Y');
      const currency = format(',.7r');
      const content = `
        <p>${currency(d[1])} Billion</p>
        <p>${dateFormat(new Date(d[0]))}</p>
      `;
      const tooltipX = `calc(${mouse(document.body)[0]}px - 50%)`;
      const tooltipY = `calc(${mouse(document.body)[1]}px - 100%)`;

      tooltip.html(content)
        .style('transform', `translate(${tooltipX}, ${tooltipY})`);

      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(100)
        .style('opacity', 0);
    });
}

json(url, (err, { data }) => {
  if (err) throw err;
  visualize(data);
});
