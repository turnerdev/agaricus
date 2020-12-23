import { AppMain } from '../src/index'

describe('AppMain unit tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  })

  it('Index page test', async () => {
    const host = { }
    const update = await AppMain.render(host)

    await update(host, container)
  })
})
