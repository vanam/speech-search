/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "images/ic_file_upload_white_24px.svg",
    "revision": "3e33445c4f69bebfeee4acc1ed768b29"
  },
  {
    "url": "images/ic_keyboard_voice_white_24px.svg",
    "revision": "737cf54985a574686cbc8643e1062bb1"
  },
  {
    "url": "images/icons/android-chrome-192x192.png",
    "revision": "7ce9681dc7fabf956eec9ef08689fa2b"
  },
  {
    "url": "images/icons/android-chrome-512x512.png",
    "revision": "9249c6133aa3afe0be02bcb076199161"
  },
  {
    "url": "images/icons/apple-touch-icon.png",
    "revision": "6fcea660a7a579bb2da1e01435a38a2f"
  },
  {
    "url": "images/icons/browserconfig.xml",
    "revision": "3992842d4a504a70dbab91cd8bdfa320"
  },
  {
    "url": "images/icons/favicon-16x16.png",
    "revision": "d5295a01c861b953d191fe5c9a687b58"
  },
  {
    "url": "images/icons/favicon-32x32.png",
    "revision": "a2089423decc6c2c1fc52f0348496781"
  },
  {
    "url": "images/icons/favicon.ico",
    "revision": "080f4e14dc688d9c2aadf82ed39be114"
  },
  {
    "url": "images/icons/mstile-150x150.png",
    "revision": "e651b4926ba9af2dc47e52b6a7861989"
  },
  {
    "url": "images/icons/safari-pinned-tab.svg",
    "revision": "2a1667434e94bb35f1ce1c08e318eeee"
  },
  {
    "url": "index.html",
    "revision": "619deee7ad1b0f9187527349b932fc6f"
  },
  {
    "url": "manifest.json",
    "revision": "143238d3dddd00ee79b4b8163be29863"
  },
  {
    "url": "README.md",
    "revision": "942c050cdb96825f9a3ef6d4698a6ab2"
  },
  {
    "url": "scripts/app.js",
    "revision": "5d25603b87fae723242b7a2bd4d166a6"
  },
  {
    "url": "styles/inline.css",
    "revision": "d007619f67b2312667148b7bd8bac1d0"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
