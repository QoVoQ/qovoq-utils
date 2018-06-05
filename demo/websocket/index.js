/**
 ** ********************************************************
 ** @file index.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-06-04 17:12:05
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-06-05 17:44:12
 ** @copyright (c) 2018 @yfe/qovoq-utils
 ** ********************************************************
 */

import WebSocketReconnect from '../../src/WebSocket/WebSocketReconnect.js'

const ws = new WebSocketReconnect('ws://localhost:3476', undefined, { debug: false })
// const ws = new WebSocket('ws://localhost:34716')

const log = (...e) => console.log(...e)
let timer = null

ws.onconnecting = e => {
  log(e)
  clearInterval(timer)
}
ws.onopen = e => {
  log(e)
  timer = setInterval(() => {
    ws.send('Are you Ok?(DEFAULT')
  },
  1500)
}
// ws.onmessage = log
ws.onclose = log
ws.onerror = e => {
  log(e)
  clearInterval(timer)
}

setInterval(() => {
  console.log('refresh connection')
  clearTimeout(timer)
  ws.refresh()
}, 5000)
