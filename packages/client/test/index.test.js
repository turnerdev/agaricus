import { AppMain } from '../src/index'

describe('AppMain unit tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  })

  it('example hybrids test', async () => {
    const host = { data1: 'hello' }
    AppMain.data2.connect(host, 'data2');
    const update = await AppMain.render(host)

    await update(host, container)

    expect(container.children[0].textContent).toBe('hello world')
  })
})
