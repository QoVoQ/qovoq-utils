/**
 * @desc: bdtongji
 * @author: zhongxian_liang
 * @date: 12/5 17:26
 */

export const injectBdtjScript = scriptSrc => {
  /* eslint-disable */
  window._hmt = window._hmt || [];
  (function () {
    var hm = document.createElement("script");
    hm.src = scriptSrc;
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
  /* eslint-disable */
}

export const trackPageView = to => {
  _hmt.push(['_setAutoPageview', false]);
  _hmt.push(['_trackPageview', `/#${to.path}`]);
};

/**
 * use in vue-router:
 *
 * import { trackPageView } from 'bdtongji'
 *
 * router.afterEach(to => {
 *  trackPageView(to)
 * })
 *  **/
