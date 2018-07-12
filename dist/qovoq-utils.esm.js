/**
 * qovoq-utils v0.0.5
 * https://github.com/QoVoQ/qovoq-utils#readme
 * @license MIT
 */
var regex = {
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?(?:[.!/\\\w]*))?)/g,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[\w\W]{6,18}$/,
  telephone: /^1[345789]\d{9}$/
}

// htmlEle id should start with letter not number

var fakeUIDCounter = 0;

var regExp = regex;

var fakeUID = function () { return ("u" + (fakeUIDCounter++) + "_" + (Math.floor(
    (1 + Math.random()) * 0x100000000
  ).toString(36))); };

var deepClone = function (obj) {
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
  document
    .getElementsByTagName('HEAD')
    .item(0)
    .appendChild(style);
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

var isEptVal = function (value) { return value === null || value === '' || value === undefined; };

var removeEptVal = function (obj) { return Object.keys(obj).reduce(function (acc, key) {
    if (!isEptVal(obj[key])) {
      acc[key] = obj[key];
    }
    return acc
  }, {}); };

var hasProperty = function (obj, key) { return obj !== null && Object.prototype.hasOwnProperty.call(obj, key); };

var normalizeNull = function (val) {
  if (val === null || val === undefined) {
    return ''
  }
  return val
};

/**
 * @description: 求字符串长度，字母和标点长度算作1，其他（如汉字）算作2
 * @param str
 */
var getBytesLen = function (str) { return [].reduce.call(
    str,
    function (acc, item, idx) {
      var charCode = str.charCodeAt(idx);
      acc += charCode >= 0 && charCode < 128 ? 1 : 2;
      return acc
    },
    0
  ); };

/**
 * @description: 获取url中的query参数
 * @param name
 * @param url
 */
var getQueryParam = function (name, url) {
  if ( url === void 0 ) url = window.location.href;

  name = name.replace(/[[]]/g, '\\$&');
  var regex$$1 = new RegExp(("[?&]" + name + "(=([^&#]*)|&|#|$)"));
  var results = regex$$1.exec(url);
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

var getRandomDayMils = function (day) {
    if ( day === void 0 ) day = 1;

    return Math.floor(Math.random() * 1000 * 60 * 60 * 24 * day);
};

var smartMerge = function (target, other) {
  Object.keys(target).forEach(function (key) {
    if (other[key] !== undefined) {
      typeof other[key] === 'object'
        ? smartMerge(target[key], other[key])
        : (target[key] = other[key]);
    }
  });
  return target
};

var index = {
  regExp: regExp,
  fakeUID: fakeUID,
  appendGlobalStyle: appendGlobalStyle,
  getDeepProperty: getDeepProperty,
  isEptVal: isEptVal,
  removeEptVal: removeEptVal,
  hasProperty: hasProperty,
  normalizeNull: normalizeNull,
  getBytesLen: getBytesLen,
  getRandomDayMils: getRandomDayMils,
  getQueryParam: getQueryParam,
  smartMerge: smartMerge
}

export default index;
export { regExp, fakeUID, deepClone, appendGlobalStyle, getDeepProperty, isEptVal, removeEptVal, hasProperty, normalizeNull, getBytesLen, getQueryParam, shuffle, getRandomDayMils, smartMerge };
