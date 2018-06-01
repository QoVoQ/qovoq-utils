import { fakeUID } from 'utils'

const ls = window.localStorage
const ss = window.sessionStorage

function setFn(storage, key, value) {
  storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
}

function getFn(storage, key) {
  const str = storage.getItem(key)
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

function removeFn(storage, key) {
  storage.removeItem(key)
}

function clearAllFn(storage) {
  storage.clear()
}
/**
 * @description: 请求成功时，利用session/local storage缓存请求结果。
 *               当下次发送相同请求时，直接返回缓存结果。
 * @date 2017/6/27 14:00
 * @author zhongxian_liang
 * @param storage this
 * @param request 必选 请求函数
 * @param data 可选 请求参数
 * @param storageKey 必选
 * @param opt 可选
 *  opt.isForced 是否无视缓存，重新发送请求
 *  opt.shouldClear 如果为true,读取后删除缓存
 */
function cacheRequestFn(storage,
  request,
  storageKey,
  data = {},
  opt = { isForced: false, shouldClear: false }) {
  storageKey += JSON.stringify(data)
  const cacheRes = !opt.isForced && storage.get(storageKey)

  if (opt.shouldClear) { storage.remove(storageKey) }

  if (cacheRes) {
    return Promise.resolve(cacheRes)
  }

  return request()
    .then(res => {
      !opt.shouldClear && storage.set(storageKey, res)
      return Promise.resolve(res)
    })
}

/**
 * @description: 请求成功时，利用session/local storage缓存请求结果。
 *               当下次发送相同请求时，直接返回缓存结果。
 * @date 2017/6/29 10:15
 * @author zhongxian_liang
 * @return{function(*=, *=): *}
 * @param request 必选 请求函数
 * @param storageKey 必选 如果不填，自动生成的storageKey虽然保存在闭包中；
 *                   但重新刷新页面，自动生成的storageKey会不一样，会重复缓存相同数据的后果
 * @param cacheOpt 可选
 *     cacheOpt.isForced 是否无视缓存，重新发送请求
 *     cacheOpt.shouldClear 如果为true,读取后删除缓存
 */
function cacheRequestAPI(request, storageKey, cacheOpt) {
  !storageKey && (storageKey = fakeUID())
  return (data, reqOpt) =>
    cacheRequestFn(
      this,
      () => request(data, reqOpt),
      storageKey,
      data,
      cacheOpt
    )
}

export const ses = {
  set(key, value) {
    setFn(ss, key, value)
  },
  get(key) {
    return getFn(ss, key)
  },
  remove(key) {
    removeFn(ss, key)
  },
  clearAll() {
    clearAllFn(ss)
  },
  cacheRequest: cacheRequestAPI
}

export const loc = {
  set(key, value) {
    setFn(ls, key, value)
  },
  get(key) {
    return getFn(ls, key)
  },
  remove(key) {
    removeFn(ls, key)
  },
  clearAll() {
    clearAllFn(ls)
  },
  cacheRequest: cacheRequestAPI
}
