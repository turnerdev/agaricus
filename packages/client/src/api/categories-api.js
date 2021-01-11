const base = `${window.location.origin}/api`

export async function getCategory(id) {
  const url = new URL(`${base}/categories/${id}`)
  return (await fetch(url)).json()
}

export async function getCategories() {
  const url = new URL(`${base}/categories`)
  return (await fetch(url)).json()
}

export async function createCategory(record) {
  const url = new URL(`${base}/categories`)
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(record),
  })
}

export async function updateCategory(record) {
  const url = new URL(`${base}/categories/${record.id}`)
  return await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(record),
  })
}

export async function deleteCategory(id) {
  const url = new URL(`${base}/categories/${id}`)
  return await fetch(url, {
    method: 'DELETE',
  })
}
