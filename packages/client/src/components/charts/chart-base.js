import { property } from 'hybrids'

export default function (init, update) {
  function d3Render({ config, data }) {
    return (host, target) => {
      if (!host.config) {
        host.config = init(host, target)
      }
      if (host.data) {
        update(host, target, host.data, host.config)
      }
    }
  }

  return {
    config: property(),
    data: property(),
    render: d3Render,
  }
}
