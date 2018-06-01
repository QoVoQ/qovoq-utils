/**
 ** ********************************************************
 ** @file error.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-02-01 10:14:18
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-02-01 11:19:11
 ** @copyright (c) 2018 @yfe/kchain-demo
 ** ********************************************************
 */

export default class GeneralError extends Error {
  constructor(message, errorCode) {
    super(message)
    this.name = 'Custom Runtime Error'
    this.errorCode = errorCode
    this.stack = (new Error()).stack
  }
}
