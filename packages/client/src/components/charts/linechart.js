import { property } from 'hybrids'
import * as d3 from 'd3'

import ChartBase from './chart-base'

import css from 'bundle-text:./linechart.css'

const width = 960
const height = 400
const adj = 30
const t = 1000 // Transition time

function init(host, target) {
  const container = document.createElement('div')

  const svg = d3
    .select(container)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [-40, -10, width + adj * 2, height + adj])

  const xScale = d3.scaleTime().range([0, width])
  const yScale = d3.scaleLinear().rangeRound([height, 0])

  const xAxis = d3
    .axisBottom()
    .ticks(10)
    .tickFormat(d3.timeFormat('%b %d'))
    .scale(xScale)
  const yAxis = d3.axisLeft().ticks(5).scale(yScale)

  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'xaxis')
  svg.append('g').attr('class', 'yaxis')

  // Apply stylesheet and build DOM
  const styleElement = document.createElement('style')
  styleElement.appendChild(document.createTextNode(css))
  target.appendChild(styleElement)
  target.appendChild(container)

  d3.select(container).append('div').classed('tooltip', true)

  return { container, svg, xAxis, yAxis, xScale, yScale }
}

function update(
  host,
  target,
  data,
  { container, svg, xAxis, xScale, yAxis, yScale }
) {
  xScale.domain([
    d3.min(data, serie => d3.min(serie.values, v => v.date)),
    d3.max(data, serie => d3.max(serie.values, v => v.date)),
  ])
  yScale.domain([
    d3.min(data, serie => d3.min(serie.values, v => v.value)),
    d3.max(data, serie => d3.max(serie.values, v => v.value)),
  ])
  svg.selectAll('.xaxis').transition().duration(t).call(xAxis)
  svg.selectAll('.yaxis').transition().duration(t).call(yAxis)

  const line = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))

  svg
    .selectAll('.line')
    .data(data)
    .join(
      enter =>
        enter
          .append('g')
          .attr('class', d => `line line-${d.index}`)
          .append('path')
          .attr('d', d => line(d.values))
          .selection(),
      update =>
        update
          .select('path')
          .transition()
          .duration(t)
          .attr('d', d => line(d.values))
          .selection(),
      exit => exit.remove()
    )
  svg
    .selectAll('.line')
    .data(data)
    .selectAll('circle')
    .data(d => d.values)
    .join(
      enter =>
        enter
          .append('circle')
          .attr(
            'transform',
            d => `translate(${xScale(d.date)},${yScale(d.value)})`
          )
          .transition()
          .delay(800)
          .duration(t / 2)
          .attr('r', 5)
          .selection()
          .on('mouseover', function (event, d) {
            d3.select(event.target)
              .transition()
              .duration(500)
              .style('stroke-width', 10)
            d3.select(container)
              .select('.tooltip')
              .html(`${d.info} - ${d.value}`)
              .style('left', event.pageX + 'px')
              .style('top', event.pageY + 'px')
              .transition()
              .duration(300)
              .style('opacity', 1)
          })
          .on('mouseout', function (event, d) {
            d3.select(event.target)
              .transition()
              .duration(500)
              .style('stroke-width', 0)
            d3.select(container)
              .select('.tooltip')
              .transition()
              .duration(300)
              .style('opacity', 0)
          }),
      update =>
        update
          .transition()
          .duration(100)
          .attr('r', 0)
          .transition()
          .duration(0)
          .attr(
            'transform',
            d => `translate(${xScale(d.date)},${yScale(d.value)})`
          )
          .transition()
          .delay(700)
          .duration(t / 2)
          .attr('r', 5)
          .selection(),
      exit => exit.transition().duration(100).attr('r', 0).remove()
    )
}

export default {
  ...ChartBase(init, update),
}
