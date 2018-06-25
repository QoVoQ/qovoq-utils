
/**
 ** ********************************************************
 ** @file index.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-01-25 11:37:46
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-06-25 09:26:03
 ** @copyright (c) 2018 @yfe/kchain-demo
 ** ********************************************************
 */

// htmlEle id should start with letter not number
export const fakeUID =
  () => `u${Math.floor((1 + Math.random()) * 0x100000000).toString(36)}`

export const deepClone =
  obj => {
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
  document.getElementsByTagName('HEAD').item(0).appendChild(style)
}

// an unreliable method of removing duplicate value in an array
// can not distinguish between 1<number> and '1'<string>
export const uniqArray = arr => {
  const obj = arr.reduce((acc, item) => {
    acc[item] = true
    return acc
  }, {})
  return Object.keys(obj)
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

export const isEptVal =
  value => value === null || value === '' || value === undefined

export const removeEptVal = obj =>
  Object.keys(obj).reduce(
    (acc, key) => {
      if (!isEptVal(obj[key])) { acc[key] = obj[key] }
      return acc
    },
    {}
  )

export const hasProperty = (obj, key) =>
  obj !== null && Object.prototype.hasOwnProperty.call(obj, key)

export const normalizeNull = val => {
  if (val === null || val === undefined) { return '' }
  return val
}

/**
 * @description: 求字符串长度，字母和标点长度算作1，其他（如汉字）算作2
 * @date 2017/7/10 17:38
 * @author zhongxian_liang
 * @return{*}
 * @param str
 */
export const getBytesLen = str => [].reduce.call(
  str,
  (acc, item, idx) => {
    const charCode = str.charCodeAt(idx)
    acc += (charCode >= 0 && charCode < 128) ? 1 : 2
    return acc
  }, 0)

/**
 * @description: 获取url中的query参数
 * @date 2017/3/17 10:49
 * @author zhongxian_liang
 * @return{*}
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
      target[key] = other[key]
    }
  })
  return target
}
