/**
 * @desc: retryRequest
 * @author: zhongxian_liang
 * @date: 12/20 16:18
 */

/**
 * @description: retry for certain times when request fails
 * - error will be counted only when http error happens, 'errcode' like '500'/'408'
 * - business error will be considered as success request, 'errcode'(with length of 6, with an exception '401') like '500101'
 * @date 12/20 16:28
 * @author zhongxian_liang
 * @param :
 * @return
 */

export const retryRequest = (reqFn, maxAttempts = 3) => {
  let timesRequested = 0
  return new Promise((resolve, reject) => {
    function inner() {
      reqFn()
        .then(res => resolve(res))
        .catch(reason => {
          if (timesRequested >= maxAttempts) {
            return reject(reason)
          }
          timesRequested++
          setTimeout(inner, Math.pow(2, timesRequested) * 100)
        })
    }

    inner()
  })
}
