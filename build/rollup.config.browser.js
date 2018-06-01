import { uglify } from 'rollup-plugin-uglify'
import { name } from '../package.json'
import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: `dist/${name}.min.js`,
    format: 'iife',
    banner
  },
  name: 'QovoqUtils'
})

config.plugins.push(uglify())

export default config
