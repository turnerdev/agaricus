const base = `${window.location.origin}/api`

export async function getAccount(id) {
  const url = new URL(`${base}/accounts/${id}`)
  return await (await fetch(url)).json()
}

export async function getAccounts() {
  const url = new URL(`${base}/accounts`)
  return await (await fetch(url)).json()
}

export async function createAccount(record) {
  const url = new URL(`${base}/accounts`)
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(record),
  })
}

export async function updateAccount(record) {
  const url = new URL(`${base}/accounts/${record.id}`)
  return await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(record),
  })
}

export async function deleteAccount(id) {
  const url = new URL(`${base}/accounts/${id}`)
  return await fetch(url, {
    method: 'DELETE',
  })
}
