// htmlEle id should start with letter not number
import regex from './regex'

let fakeUIDCounter = 0

const _pipe = (a, b) => args => b(a(args))

export const pipe = (...ops) => ops.reduce(_pipe)

export const regExp = regex

export const fakeUID = () =>
  `u${fakeUIDCounter++}_${Math.floor(
    (1 + Math.random()) * 0x100000000
  ).toString(36)}`

export const deepClone = obj => {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (e) {
    throw new Error('Fail to deep clone an object.')
  }
}

export const appendGlobalStyle = cssText => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = cssText
  document
    .getElementsByTagName('HEAD')
    .item(0)
    .appendChild(style)
}

// safely get deep path property like a.b.c[0]
export const getDeepProperty = (target, propStr) => {
  let obj = target
  const prop = propStr.split('.')
  for (let i = 0; i < prop.length; i++) {
    if (typeof obj === 'object' && obj !== null) {
      obj = obj[prop[i]]
    } else {
      return null
    }
  }
  return obj
}

export const isEptVal = value =>
  value === null || value === '' || value === undefined

export const removeEptVal = obj =>
  Object.keys(obj).reduce((acc, key) => {
    if (!isEptVal(obj[key])) {
      acc[key] = obj[key]
    }
    return acc
  }, {})

export const hasProperty = (obj, key) =>
  obj !== null && Object.prototype.hasOwnProperty.call(obj, key)

export const normalizeNull = val => {
  if (val === null || val === undefined) {
    return ''
  }
  return val
}

/**
 * @description: 求字符串长度，字母和标点长度算作1，其他（如汉字）算作2
 * @param str
 */
export const getBytesLen = str =>
  [].reduce.call(
    str,
    (acc, item, idx) => {
      const charCode = str.charCodeAt(idx)
      acc += charCode >= 0 && charCode < 128 ? 1 : 2
      return acc
    },
    0
  )

/**
 * @description: 获取url中的query参数
 * @param name
 * @param url
 */
export const getQueryParam = (name, url = window.location.href) => {
  name = name.replace(/[[]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) {
    return null
  }
  if (!results[2]) {
    return ''
  }
  return window.decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// mess up an array
export const shuffle = arr => {
  const cp = arr.slice()

  function swap(ar, i, j) {
    const tmp = ar[i]
    ar[i] = ar[j]
    ar[j] = tmp
  }

  for (let i = cp.length; i--; i > 0) {
    swap(cp, i, Math.floor(Math.random() * i))
  }

  return cp
}

export const getRandomDayMils = (day = 1) =>
  Math.floor(Math.random() * 1000 * 60 * 60 * 24 * day)

export const smartMerge = (target, other) => {
  Object.keys(target).forEach(key => {
    if (other[key] !== undefined) {
      Array.isArray(other[key])
        ? (target[key] = deepClone(other[key]))
        : typeof other[key] === 'object'
          ? smartMerge(target[key], other[key])
          : (target[key] = other[key])
    }
  })
  return target
}

export const downloadCanvas = (filename, canvas, $link) => {
  if (canvas.msToBlob) {
    const blob = canvas.msToBlob()
    window.navigator.msSaveBlob(blob, filename)
    return
  }

  $link.download = filename
  $link.href = canvas.toDataURL('image/png')
  $link.click()
}

export default {
  regExp,
  fakeUID,
  deepClone,
  appendGlobalStyle,
  downloadCanvas,
  getDeepProperty,
  isEptVal,
  removeEptVal,
  hasProperty,
  normalizeNull,
  getBytesLen,
  getRandomDayMils,
  getQueryParam,
  smartMerge
}
