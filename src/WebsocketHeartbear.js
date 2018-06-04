/**
 *  This is under construction!!
 * An simple enhanced websocket with features:
 *  i. reconnect
 *    @see https://github.com/joewalnes/reconnecting-websocket/blob/master/reconnecting-websocket.js
 *  ii. heartbeat
 *
 */

export class WebSocketHeartbeat {
  constructor({
    url,
    onOpen,
    onMessage,
    onClose,
    heartbeatInterval = 10 * 1000,
    heartbeatResTimeout = 5 * 1000
  }) {
    if (!WebSocket) {
      throw new Error('WebSocket is not available!')
    }
    this.ws = null
    this.url = url
    this.heartbeatInterval = heartbeatInterval
    this.heartbeatIntervalTimer = null
    this.heartbeatResTimeout = heartbeatResTimeout
    this.heartbeatResTimeoutTimer = null
    this.isReconnecting = false
    this.handlers = { onOpen, onMessage, onClose }
    this.createSocket()
    this.reconnectTime = 0
  }

  createSocket() {
    this.ws = new WebSocket(this.url)
    this.initEvents()
  }

  initEvents() {
    this.ws.onopen = e => {
      this.startHeartbeat()
      this.handlers.onOpen(e)
    }

    this.ws.onmessage = e => {
      this.resetHeartbeat()
      this.handlers.onMessage(e)
    }

    this.ws.onerror = () => {
      this.clean()
      this.reconnect()
    }

    this.ws.onclose = e => {
      this.clean()
      this.handlers.onClose(e)
    }
  }

  resetHeartbeat() {
    clearTimeout(this.heartbeatResTimeoutTimer)
  }

  sendHeartbeat() {
    this.ws.send(JSON.stringify({ event: 'heartBeatEvent', data: 'heart' }))

    this.heartbeatResTimeoutTimer = setTimeout(() => {
      this.ws.close()
    }, this.heartbeatResTimeout)
  }

  startHeartbeat() {
    this.sendHeartbeat()
    this.heartbeatIntervalTimer =
      setInterval(() => { this.sendHeartbeat() }, this.heartbeatInterval)
  }

  clean() {
    clearInterval(this.heartbeatIntervalTimer)
    clearTimeout(this.heartbeatResTimeoutTimer)
  }

  reconnect() {
    if (this.isReconnecting) {
      return
    }

    this.isReconnecting = true
    setTimeout(() => {
      try {
        this.createSocket()
      } catch (e) {
        this.clean()
        throw e
      } finally {
        this.isReconnecting = false
      }
    }, 2000)
  }

  close() {
    this.ws.close()
  }

  send(data) {
    this.ws.send(data)
  }
}
