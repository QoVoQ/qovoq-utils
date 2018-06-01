/**
 ** ********************************************************
 ** @file rollup.config.base.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-06-01 14:04:51
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-06-01 14:06:49
 ** @copyright (c) 2018 @yfe/qovoq-utils
 ** ********************************************************
 */

import { name, version, homepage } from '../package.json'
import buble from 'rollup-plugin-buble'

export const banner = `/**
 * ${name} v${version}
 * ${homepage}
 * @license MIT
 */`

export default {
  input: 'src/index.js',
  plugins: [
    buble()
  ]
}
