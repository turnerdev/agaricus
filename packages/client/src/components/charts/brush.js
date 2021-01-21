import { dispatch, property } from 'hybrids'
import * as d3 from 'd3'

import ChartBase from './chart-base'
import css from 'bundle-text:./brush.css'

const width = 1000
const height = 120
const margin = { top: 0, right: 0, bottom: 20, left: 0 }
const interval = d3.timeDay.every(7)

xAxis = (g, x) =>
  g
    .call(g =>
      g
        .select('.ticks')
        .call(
          d3
            .axisBottom(x)
            .ticks(interval)
            .tickSize(-height + margin.top + margin.bottom)
            .tickFormat(() => null)
        )
        .call(g =>
          g.select('.domain').attr('fill', '#eee').attr('stroke', null)
        )
        .call(g =>
          g
            .selectAll('.tick line')
            .attr('stroke', '#fff')
            .attr('stroke-opacity', d => (d <= d3.timeDay(d) ? 1 : 0.5))
        )
    )
    .call(g =>
      g
        .select('.xaxis')
        .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickPadding(0))
        .attr('text-anchor', null)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('text').attr('x', 6))
    )

function init(host, target) {
  const container = document.createElement('div')

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
  // .classed('svg-content', true)

  const brush = d3
    .brushX()
    .extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom],
    ])
    .on('end', brushended)

  function brushended(event) {
    const selection = event.selection
    if (!event.sourceEvent || !selection) return
    const [x0, x1] = selection.map(d => interval.round(host.config.x.invert(d)))
    dispatch(host, 'change', { detail: [x0, x1] })
    d3.select(this)
      .transition()
      .call(brush.move, x1 > x0 ? [x0, x1].map(host.config.x) : null)
  }

  svg
    .append('g')
    .attr('class', 'background')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(g => g.append('g').attr('class', 'ticks'))
    .call(g => g.append('g').attr('class', 'xaxis'))

  svg.append('g').call(brush)

  const styleElement = document.createElement('style')
  styleElement.appendChild(document.createTextNode(css))
  target.appendChild(styleElement)
  target.appendChild(container)
  const yScale = d3.scaleLinear().rangeRound([height, 0])

  return { svg, yScale }
}

function update(host, target, olddata, { svg, yScale }) {
  const data = olddata.reduce(
    (values, account) => [...values, ...account.values],
    []
  )
  const dates = data.map(datum => datum.date)
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)

  const x = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .rangeRound([margin.left, width - margin.right])

  yScale
    .domain([d3.min(data, v => v.value), d3.max(data, v => v.value)])
    .rangeRound([margin.top, height - margin.bottom])

  host.config = {
    ...host.config,
    x,
  }

  svg.select('.background').call(g => xAxis(g, x))

  svg
    .selectAll('circle')
    .data(data)
    .join(
      enter =>
        enter
          .append('circle')
          .style('fill', d => (d.value < 0 ? '#933' : '#393'))
          .attr('transform', d => `translate(${x(d.date)},${yScale(d.value)})`)
          .attr('r', 2),
      update =>
        update.attr(
          'transform',
          d => `translate(${x(d.date)},${yScale(d.value)})`
        ),
      exit => exit.remove()
    )
}

export default {
  ...ChartBase(init, update),
}
