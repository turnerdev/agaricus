const base = `${window.location.origin}/api`

export async function getImports() {
  const url = new URL(`${base}/uploads`)
  return (await fetch(url)).json()
}

export async function uploadFiles(accountId, files) {
  const fd = new FormData()
  files.forEach((file, i) => fd.append(`file${i}`, file))

  return (await fetch(`${base}/accounts/${accountId}/upload`, {
    method: 'POST',
    body: fd
  })).text()
}