import EventEmitter from '../EventEmitter.js'

/**
 * Base on: https://github.com/joewalnes/reconnecting-websocket/ by Joe Walnes
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
 * This behaves like a WebSocket in every way, except if it fails to connect,
 * or it gets disconnected, it will repeatedly poll until it successfully connects
 * again.
 *
 * @TODO Add heartbeat(should reconnect when heartbeat response timeout)
 *
 * It is API compatible, so when you have:
 *   ws = new WebSocket('ws://....');
 * you can replace with:
 *   ws = new WebSocketReconnect('ws://....');
 *
 * The event stream will typically look like:
 *  onconnecting
 *  onopen
 *  onmessage
 *  onmessage
 *  onconnecting // lost connection: previous connection closed, start reconnecting
 *               // PS: clean up job should be done in `onconnecting` handler
 *  onerror // error caused by failure of previous connection
 *  onopen  // sometime later...
 *  onmessage
 *  onmessage
 *  etc...
 *
 * It is API compatible with the standard WebSocket API, apart from the following members:
 *
 * - `bufferedAmount`
 * - `extensions`
 * - `binaryType`
 *
 * Syntax
 * ======
 * var socket = new WebSocketReconnect(url, protocols, options);
 *
 * Parameters
 * ==========
 * url - The url you are connecting to.
 * protocols - Optional string or array of protocols.
 * options - See below
 *
 * Options
 * =======
 * Options can either be passed upon instantiation or set after instantiation:
 *
 * var socket = new WebSocketReconnect(url, null, { debug: true, reconnectInterval: 4000 });
 *
 * or
 *
 * var socket = new WebSocketReconnect(url);
 * socket.debug = true;
 * socket.reconnectInterval = 4000;
 *
 * debug
 * - Whether this instance should log debug messages. Accepts true or false. Default: false.
 *
 * automaticOpen
 * - Whether or not the websocket should attempt to connect immediately upon instantiation. The socket can be manually opened or closed at any time using ws.open() and ws.close().
 *
 * reconnectInterval
 * - The number of milliseconds to delay before attempting to reconnect. Accepts integer. Default: 1000.
 *
 * maxReconnectInterval
 * - The maximum number of milliseconds to delay a reconnection attempt. Accepts integer. Default: 30000.
 *
 * reconnectDecay
 * - The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. Accepts integer or float. Default: 1.5.
 *
 * timeoutInterval
 * - The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. Accepts integer. Default: 2000.
 *
 */

const DEFAULT_SETTING = {
  /** Whether this instance should log debug messages. */
  debug: false,

  /** Whether or not the websocket should attempt to connect immediately upon instantiation. */
  automaticOpen: true,

  /** The number of milliseconds to delay before attempting to reconnect. */
  reconnectInterval: 1000,
  /** The maximum number of milliseconds to delay a reconnection attempt. */
  maxReconnectInterval: 30000,
  /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
  reconnectDecay: 1.5,

  /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
  timeoutInterval: 2000,

  /** The maximum number of reconnection attempts to make. Unlimited if null. */
  maxReconnectAttempts: null,

  /** The binary type, possible values 'blob' or 'arraybuffer', default 'blob'. */
  binaryType: 'blob'
}

class WebSocketReconnect extends EventEmitter {
  constructor(
    url,
    protocols,
    options = DEFAULT_SETTING
  ) {
    if (!WebSocket) {
      throw new Error('WebSocket is not available!')
    }

    super()

    // These should be treated as read-only properties

    /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
    this.url = url

    /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
    this.reconnectAttempts = 0

    /**
     * The current state of the connection.
     * Can be one of: WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED
     * Read only.
     */
    this.readyState = WebSocket.CONNECTING

    /**
     * A string indicating the name of the sub-protocol the server selected; this will be one of
     * the strings specified in the protocols parameter when creating the WebSocket object.
     * Read only.
     */
    this.protocols = protocols

    // protocol the server selected when `readyState` is `OPEN`
    this.protocol = undefined
    this.options = { ...DEFAULT_SETTING, ...options }

    // Private state variables

    this.ws = null
    this.forcedClose = false

    // Wire up "on*" properties as event handlers
    // ws.onopen = function(e) { ... }

    this.addEventListener('open', e => this.onopen(e))
    this.addEventListener('close', e => this.onclose(e))
    this.addEventListener('connecting', e => this.onconnecting(e))
    this.addEventListener('message', e => this.onmessage(e))
    this.addEventListener('error', e => this.onerror(e))

    // Whether or not to create a websocket upon instantiation
    if (this.options.automaticOpen === true) {
      // open connection at the end of current event loop, in case of event dispatching
      // before the process of listeners attachment at current event loop
      // e.g. You may miss the first 'connecting' event when you initializing
      //      websocket if `this.open` not being wrapped in Promise.prototype.then
      Promise.resolve().then(() => {
        this.open(false)
      })
    }
  }

  open(isReconnecting = true) {
    this.ws = new WebSocket(this.url, this.protocols || [])
    this.ws.binaryType = this.options.binaryType

    if (isReconnecting) {
      if (this.options.maxReconnectAttempts && this.reconnectAttempts > this.options.maxReconnectAttempts) {
        // @TODO should emit close/error event ?
        return
      }
    } else {
      this.dispatchEvent(EventEmitter.createEvent('connecting', this))
      this.reconnectAttempts = 0
    }

    if (this.options.debug) {
      console.log('WebSocketReconnect', 'attempt-connect', this.url)
    }

    const connectionCreationTimeout = setTimeout(() => {
      if (this.options.debug) {
        console.log('WebSocketReconnect', 'connection-timeout', this.url)
      }
      this.ws.close()
    }, this.options.timeoutInterval)

    this.ws.onopen = event => {
      clearTimeout(connectionCreationTimeout)
      if (this.options.debug) {
        console.log('WebSocketReconnect', 'onopen', this.url)
      }
      this.protocol = this.ws.protocol
      this.readyState = WebSocket.OPEN
      this.reconnectAttempts = 0
      const e = EventEmitter.createEvent('open', this)
      e.isReconnect = isReconnecting
      this.dispatchEvent(e)
    }

    this.ws.onclose = event => {
      clearTimeout(connectionCreationTimeout)
      this.ws = null

      // connection finish normally
      if (this.forcedClose) {
        this.readyState = WebSocket.CLOSED
        return this.dispatchEvent(EventEmitter.createEvent('close', this))
      }

      // error happen, need to reconnect
      this.readyState = WebSocket.CONNECTING
      var e = EventEmitter.createEvent('connecting', this)
      e.code = event.code
      e.reason = event.reason
      e.wasClean = event.wasClean
      this.dispatchEvent(e)

      const timeout =
        this.options.reconnectInterval * Math.pow(this.options.reconnectDecay, this.reconnectAttempts)
      setTimeout(
        () => {
          this.reconnectAttempts++
          this.open(true)
        },
        timeout > this.options.maxReconnectInterval
          ? this.options.maxReconnectInterval
          : timeout
      )
    }

    this.ws.onmessage = event => {
      if (this.options.debug) {
        console.log('WebSocketReconnect', 'onmessage', this.url, event.data)
      }
      const e = EventEmitter.createEvent('message', this)
      e.data = event.data
      this.dispatchEvent(e)
    }

    this.ws.onerror = event => {
      if (this.options.debug) {
        console.log('WebSocketReconnect', 'onerror', this.url, event)
      }
      this.dispatchEvent(EventEmitter.createEvent('error', this))
    }
  }

  /**
   * Transmits data to the server over the WebSocket connection.
   *
   * @param data a text string, ArrayBuffer or Blob to send to the server.
  */
  send(data) {
    if (this.ws) {
      if (this.options.debug) {
        console.debug('WebSocketReconnect', 'send', this.url, data)
      }
      return this.ws.send(data)
    }
    throw new Error('INVALID_STATE_ERR : Pausing to reconnect websocket')
  };

  /**
   * Closes the WebSocket connection or connection attempt, if any.
   * If the connection is already CLOSED, this method does nothing.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
   * Default CLOSE_NORMAL code
   */
  close(code = 1000, reason) {
    this.forcedClose = true
    if (this.ws) {
      this.ws.close(code, reason)
    }
  };

  /**
   * Additional public API method to refresh the connection if still open (close, re-open).
   * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
   */
  refresh() {
    if (this.ws) {
      this.ws.close()
    }
  };

  onopen() { }
  onclose() { }
  onconnecting() { }
  onmessage() { }
  onerror() { }
}

WebSocketReconnect.CONNECTING = WebSocket.CONNECTING
WebSocketReconnect.OPEN = WebSocket.OPEN
WebSocketReconnect.CLOSING = WebSocket.CLOSING
WebSocketReconnect.CLOSED = WebSocket.CLOSED

export default WebSocketReconnect
