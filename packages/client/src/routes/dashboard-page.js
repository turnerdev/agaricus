import { define, html, property, store } from 'hybrids'

import { Account, TransactionList } from '../stores'

import LineChart from '../components/charts/linechart'
import PieChart from '../components/charts/piechart'
import Brush from '../components/charts/brush'

import style from 'bundle-text:../style.css'

function handleBrushChange(host, event) {
  host.dates = event.detail
}

async function getPieChartData(transactions) {
  console.info('Generating pie chart data', transactions)
  return await transactions.reduce(async (aggP, current) => {
    const agg = await aggP
    let category = await (store.pending(current.category) || current.category)
    if (category) {
      if (!agg.colors[category.name]) {
        agg.colors[category.name] = category.color
      }

      if (!agg.data[category.name]) {
        agg.data[category.name] = 0
      }
      agg.data[category.name] += Math.abs(current.amount)
    }
    return agg
  }, Promise.resolve({ data: {}, colors: {} }))
}

function getLineChartData(transactions) {
  console.info('Generating line chart data')
  const agg = transactions.reduce((agg, current) => {
    if (!agg.hasOwnProperty(current.account_id)) {
      agg[current.account_id] = { id: current.account_id, values: [] }
    }
    const serie = agg[current.account_id].values
    serie.push({
      info: current.description,
      date: new Date(Number(current.date)),
      value:
        serie.length === 0
          ? Number(current.amount)
          : Number(current.amount) + serie[serie.length - 1].value,
    })
    return agg
  }, {})
  return Object.values(agg).map((record, index) => ({
    ...record,
    index,
  }))
}

async function filterTransactions(host) {
  const data = (await (store.pending(host.transactions) || host.transactions))
    .items

  if (host.dates) {
    const [start, end] = host.dates
    const filtered = data.filter(rec => {
      const d = new Date(Number(rec.date))
      return d >= start && d <= end
    })

    return filtered
  }
  return data
}

async function updateData(host) {
  const allData = (
    await (store.pending(host.transactions) || host.transactions)
  ).items
  const data = await filterTransactions(host)
  host.pieChartData = await getPieChartData(data)
  host.lineChartData = await getLineChartData(data)
  host.brushData = await getLineChartData(allData)
}

export default {
  perPage: {
    connect: (host, key) => {
      host[key] = 30000
    },
  },
  dates: {
    connect: async (host, key) => {
      host[key] = null
      updateData(host)
    },
    observe: updateData,
  },
  accounts: store([Account]),
  transactions: store(TransactionList, ({ perPage }) => ({
    perPage,
  })),
  brushData: property(),
  lineChartData: property(),
  pieChartData: property(),
  render: ({
    accounts,
    brushData,
    lineChartData,
    pieChartData,
    transactions,
  }) =>
    html`
      ${store.ready(accounts) &&
      store.ready(transactions) &&
      html` <div class="bg-white shadow p-4 mb-2">
          <app-brush
            data=${brushData}
            onchange=${handleBrushChange}
          ></app-brush>
        </div>
        <div class="grid grid-cols-4 gap-2">
          <div class="bg-white shadow p-4 flex flex-row col-span-3">
            <app-linechart data=${lineChartData}></app-linechart>
          </div>
          <div class="bg-white shadow p-4 flex flex-row items-center">
            <app-piechart data=${pieChartData}></app-piechart>
          </div>
        </div>`}
    `.style(style),
}

define('app-linechart', LineChart)
define('app-piechart', PieChart)
define('app-brush', Brush)
