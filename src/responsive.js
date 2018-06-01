/**
 ** ********************************************************
 ** @file responsive.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-06-01 14:44:21
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-06-01 15:04:12
 ** @copyright (c) 2018 @yfe/qovoq-utils
 ** ********************************************************
 */

export const setRootFontSize = () => {
  // 1rem = 20px
  const xViewport = window.innerWidth
  const maxWidth = xViewport > 414 ? 414 : xViewport
  const fs = Math.floor(maxWidth / 18.75)
  window.document.documentElement.style.fontSize = `${fs}px`
}

/**
 *  Usage:
 *   call setRootFontSize() as soon as possible
 *   in css file, use unit `rem`
 *
 *   this.setRootFontSize();
 *   window.addEventListener('resize', this.setRootFontSize, false);
 * **/
