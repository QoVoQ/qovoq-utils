import {name, version, homepage} from '../package.json'
import buble from 'rollup-plugin-buble'

export const banner = `/**
 * ${name} v${version}
 * ${homepage}
 * @license MIT
 */`

export default {
  input: 'src/index.js',
  plugins: [buble()]
}
