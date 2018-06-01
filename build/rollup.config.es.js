import { name } from '../package.json'
import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: `dist/${name}.esm.js`,
    format: 'es',
    banner
  }
})

export default config
