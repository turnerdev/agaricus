const base = `${window.location.origin}/api`

export async function getTransactions(params) {
  const url = new URL(`${base}/transactions`)
  url.search = new URLSearchParams(params).toString();
  return (await fetch(url)).json()
}

export async function getTransaction(id) {
  const url = new URL(`${base}/transactions/${id}`)
  return (await fetch(url)).json()
}

export async function updateTransactions(records) {
  const url = new URL(`${base}/transactions`)
  return await (await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(records)
  })).text() // TODO
}

export async function deleteTransactions() {
  return fetch(`/api/transactions`, { method: 'DELETE' })
}
