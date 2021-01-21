import { property } from 'hybrids'
import * as d3 from 'd3'

import ChartBase from './chart-base'
import css from 'bundle-text:./piechart.css'

const width = 400
const height = 400
const radius = Math.min(width, height) / 2
const t = 1000

function init(host, target) {
  const container = document.createElement('div')

  const svg = d3
    .select(container)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [0, 0, width, height])
    .classed('svg-content', true)
    .append('g')

  svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  svg.append('g').attr('class', 'slices')
  svg.append('g').attr('class', 'labels')
  svg.append('g').attr('class', 'lines')

  const pie = d3
    .pie()
    .sort(null)
    .value(d => d.value)

  const styleElement = document.createElement('style')
  styleElement.appendChild(document.createTextNode(css))
  target.appendChild(styleElement)
  target.appendChild(container)

  const key = d => d.data.label

  const arc = d3
    .arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4)

  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  return { svg, pie, key, arc, outerArc }
}

function update(host, target, { data, colors }, { svg, pie, key, arc }) {
  if (!data) return

  const { domain, range } = Object.keys(colors)
    .sort()
    .reduce(
      (acc, label) => ({
        domain: [...acc.domain, label],
        range: [...acc.range, colors[label]],
      }),
      { domain: [], range: [] }
    )

  const color = d3.scaleOrdinal().domain(domain).range(range)
  const ndata = Object.keys(data).reduce(
    (a, k) => [
      ...a,
      {
        label: k,
        value: data[k],
      },
    ],
    []
  )

  var slice = svg
    .select('.slices')
    .selectAll('path.slice')
    .data(pie(ndata), key)

  slice
    .enter()
    .insert('path')
    .style('fill', d => color(d.data.label))
    .attr('class', 'slice')
    .merge(slice)
    .transition()
    .duration(t)
    .attrTween('d', function (d) {
      this._current = this._current || d
      var interpolate = d3.interpolate(this._current, d)
      this._current = interpolate(0)
      return function (t) {
        return arc(interpolate(t))
      }
    })

  slice.exit().remove()
}

export default {
  ...ChartBase(init, update),
}
