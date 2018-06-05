/**
 * EventEmitter for browser (IE9+)
 */

class EventEmitter {
  constructor() {
    if (!document) {
      throw new Error('Failed to find object `document`!')
    }
    this.eventTarget = document.createElement('div')
  }

  /**
   * This function generates an event that is compatible with standard
   * compliant browsers and IE9 - IE11
   *
   * This will prevent the error:
   * Object doesn't support this action
   *
   * http://stackoverflow.com/questions/19345392/why-arent-my-parameters-getting-passed-through-to-a-dispatched-event/19345563#19345563
   * @param event String The name that the event should use
   * @param argObj Object an optional object that the event will use
   */
  static createEvent(event, argObj) {
    if (document.createEvent) {
      const evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(event, false, false, argObj)
      return evt
    }

    try {
      return new CustomEvent(
        event,
        { detail: argObj }
      )
    } catch (e) {
      throw new Error('Failed to initialize custom event!')
    }
  }

  addEventListener(eventName, listener) {
    this.eventTarget.addEventListener(eventName, listener)
  }

  removeEventListener(eventName, listener) {
    this.eventTarget.removeEventListener(eventName, listener)
  }

  dispatchEvent(event) {
    this.eventTarget.dispatchEvent(event)
  }
}

export default EventEmitter
