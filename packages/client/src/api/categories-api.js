const base = `${window.location.origin}/api`

export async function getCategories() {
  const url = new URL(`${base}/categories`)
  return (await fetch(url)).json()
}

export async function addCategory(record) {
  const url = new URL(`${base}/categories`)
  return (await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(record)
  })).json()
}
