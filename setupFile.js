const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// h/t https://github.com/airbnb/enzyme/issues/942#issuecomment-314715229
const { document } = (new JSDOM('')).window;

global.window = document.defaultView;

/**
 * Window resize helper.
 * h/t https://github.com/pksjce/jest-blog-samples/blob/master/window-testing/setupFile.js
 *
 * @param {Integer} width  The desired width.
 * @param {Integer} height The desired height.
 */
global.window.resizeTo = (width, height) => {
  global.window.innerWidth = width || global.window.innerWidth;
  global.window.innerHeight = height || global.window.innerHeight;
  global.window.dispatchEvent(new Event('resize'));
};

/**
 * Patch HTMLElement.offsetWidth support.
 *
 * @see https://github.com/jsdom/jsdom/issues/135#issuecomment-68191941
 */
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: { get: () => parseFloat(global.window.innerWidth) || 0 }
});
