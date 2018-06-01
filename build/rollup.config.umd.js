import { name } from '../package.json'
import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: `dist/${name}.umd.js`,
    format: 'umd',
    banner
  },
  name: 'QovoqUtils'
})

export default config
