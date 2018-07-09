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
