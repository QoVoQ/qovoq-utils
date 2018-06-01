/**
 * qovoq-utils v0.0.1
 * https://github.com/QoVoQ/qovoq-utils#readme
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.QovoqUtils = {})));
}(this, (function (exports) { 'use strict';

  /**
   ** ********************************************************
   ** @file index.js
   ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
   ** @date 2018-01-25 11:37:46
   ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
   ** @last_modified_date 2018-06-01 15:24:27
   ** @copyright (c) 2018 @yfe/kchain-demo
   ** ********************************************************
   */

  // htmlEle id should start with letter not number
  var fakeUID =
    function () { return ("u" + (Math.floor((1 + Math.random()) * 0x100000000).toString(36))); };

  var deepClone =
    function (obj) {
      try {
        return JSON.parse(JSON.stringify(obj))
      } catch (e) {
        throw new Error('Fail to deep clone an object.')
      }
    };

  var appendGlobalStyle = function (cssText) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssText;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);
  };

  // an unreliable method of removing duplicate value in an array
  // can not distinguish between 1<number> and '1'<string>
  var uniqArray = function (arr) {
    var obj = arr.reduce(function (acc, item) {
      acc[item] = true;
      return acc
    }, {});
    return Object.keys(obj)
  };

  // safely get deep path property like a.b.c[0]
  var getDeepProperty = function (target, propStr) {
    var obj = target;
    var prop = propStr.split('.');
    for (var i = 0; i < prop.length; i++) {
      if (typeof obj === 'object' && obj !== null) {
        obj = obj[prop[i]];
      } else {
        return null
      }
    }
    return obj
  };

  var isEptVal =
    function (value) { return value === null || value === '' || value === undefined; };

  var removeEptVal = function (obj) { return Object.keys(obj).reduce(
      function (acc, key) {
        if (!isEptVal(obj[key])) { acc[key] = obj[key]; }
        return acc
      },
      {}
    ); };

  var hasProperty = function (obj, key) { return obj !== null && Object.prototype.hasOwnProperty.call(obj, key); };

  var normalizeNull = function (val) {
    if (val === null || val === undefined) { return '' }
    return val
  };

  /**
   * @description: 求字符串长度，字母和标点长度算作1，其他（如汉字）算作2
   * @date 2017/7/10 17:38
   * @author zhongxian_liang
   * @return{*}
   * @param str
   */
  var getBytesLen = function (str) { return [].reduce.call(
    str,
    function (acc, item, idx) {
      var charCode = str.charCodeAt(idx);
      acc += (charCode >= 0 && charCode < 128) ? 1 : 2;
      return acc
    }, 0); };

  /**
   * @description: 获取url中的query参数
   * @date 2017/3/17 10:49
   * @author zhongxian_liang
   * @return{*}
   * @param name
   * @param url
   */
  var getQueryParam = function (name, url) {
    if ( url === void 0 ) url = window.location.href;

    name = name.replace(/[[]]/g, '\\$&');
    var regex = new RegExp(("[?&]" + name + "(=([^&#]*)|&|#|$)"));
    var results = regex.exec(url);
    if (!results) {
      return null
    }
    if (!results[2]) {
      return ''
    }
    return window.decodeURIComponent(results[2].replace(/\+/g, ' '))
  };

  // mess up an array
  var shuffle = function (arr) {
    var cp = arr.slice();

    function swap(ar, i, j) {
      var tmp = ar[i];
      ar[i] = ar[j];
      ar[j] = tmp;
    }

    for (var i = cp.length; i--; i > 0) {
      swap(cp, i, Math.floor(Math.random() * i));
    }

    return cp
  };

  exports.fakeUID = fakeUID;
  exports.deepClone = deepClone;
  exports.appendGlobalStyle = appendGlobalStyle;
  exports.uniqArray = uniqArray;
  exports.getDeepProperty = getDeepProperty;
  exports.isEptVal = isEptVal;
  exports.removeEptVal = removeEptVal;
  exports.hasProperty = hasProperty;
  exports.normalizeNull = normalizeNull;
  exports.getBytesLen = getBytesLen;
  exports.getQueryParam = getQueryParam;
  exports.shuffle = shuffle;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
