import Pager from '../src/components/pager'

describe('Pager component unit tests', () => {
  let container
  let host

  beforeEach(() => {
    container = document.createElement('div')
  })

  it('Pager display beginning test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 1 }
    host.displayedPages = Pager.displayedPages.get(host)

    let update = await Pager.render(host)
    await update(host, container)

    expect(container.children[0].textContent.replace(/\s/g,'')).toContain('123...9')
  })

  it('Pager display middle test', async () => {
    const host = { neighbourhood: 1, pages: 9, currentPage: 4 }
    host.displayedPages = Pager.displayedPages.get(host)

    let update = await Pager.render(host)
    await update(host, container)

    expect(container.children[0].textContent.replace(/\s/g,'')).toContain('1...345...9')
  })

  it('Pager display end test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 6 }
    host.displayedPages = Pager.displayedPages.get(host)

    let update = await Pager.render(host)
    await update(host, container)

    expect(container.children[0].textContent.replace(/\s/g,'')).toContain('1...456789')
  })

  it('Pager navigation goto page test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 1 }
    host.displayedPages = Pager.displayedPages.get(host)
    host.dispatchEvent = jest.fn(event => event.detail)

    let update = await Pager.render(host)
    await update(host, container)
    container.querySelector("a[data-page='2']").click(host)

    expect(host.dispatchEvent).toHaveReturnedWith(2)
  })

  it('Pager navigation previous test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 3 }
    host.displayedPages = Pager.displayedPages.get(host)
    host.dispatchEvent = jest.fn(event => event.detail)

    let update = await Pager.render(host)
    await update(host, container)
    container.querySelector("a:first-child").click(host)

    expect(host.dispatchEvent).toHaveReturnedWith(2)
  })

  it('Pager navigation next test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 3 }
    host.displayedPages = Pager.displayedPages.get(host)
    host.dispatchEvent = jest.fn(event => event.detail)

    let update = await Pager.render(host)
    await update(host, container)
    container.querySelector("a:last-child").click(host)

    expect(host.dispatchEvent).toHaveReturnedWith(4)
  }
  )
  it('Pager navigation previous from first page test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 1 }
    host.displayedPages = Pager.displayedPages.get(host)
    host.dispatchEvent = jest.fn(event => event.detail)

    let update = await Pager.render(host)
    await update(host, container)
    container.querySelector("a:first-child").click(host)

    expect(host.dispatchEvent).toHaveBeenCalledTimes(0)
  })

  it('Pager navigation next from last test', async () => {
    const host = { neighbourhood: 2, pages: 9, currentPage: 9 }
    host.displayedPages = Pager.displayedPages.get(host)
    host.dispatchEvent = jest.fn(event => event.detail)

    let update = await Pager.render(host)
    await update(host, container)
    container.querySelector("a:last-child").click(host)

    expect(host.dispatchEvent).toHaveBeenCalledTimes(0)
  })
})