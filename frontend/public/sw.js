if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const o=e=>a(e,i),r={module:{uri:i},exports:t,require:o};s[i]=Promise.all(n.map((e=>r[e]||o(e)))).then((e=>(c(...e),t)))}}define(["./workbox-62f137f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/server/middleware-chunks/606.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/middleware-chunks/773.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/middleware-runtime.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/pages/cart/_middleware.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/pages/transaction/_middleware.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/pages/user/auth/_middleware.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/pages/user/edit/_middleware.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/server/pages/user/manage/_middleware.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/ToVuoTGLhl_c4G6LzK-aX/_buildManifest.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/ToVuoTGLhl_c4G6LzK-aX/_middlewareManifest.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/ToVuoTGLhl_c4G6LzK-aX/_ssgManifest.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/308-16ae0bfa8ebe7bcc.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/339-2df31c42844e0652.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/366-6a6f2cfb5869de94.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/409-67ae658e1b6ac2b6.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/58a6c8d1-a264fecdde2870fc.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/framework-dc33c0b5493501f0.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/main-e2c2ddd3a4195cde.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/_app-d3c4b70d4b310668.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/_error-a3f18418a2205cb8.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/about-f234b8691cf81f8a.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/cart-b7ce90995b71b173.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/cart/checkout-680ce8c5b589932c.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/cart/wishlist-e59a6e0a9b4c0f6f.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/chat-2287797f7cfe22b0.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/index-543daf6308396a94.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/product/%5Bid%5D-3f58cd99df220176.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/product/%5Bid%5D/edit-2c700d2aa0df4dd9.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/product/sell-f5b524b9aee3edbf.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/search-7997c31a63af09d5.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/shop/%5Bslug%5D-7f38050281c830cb.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/shop/edit-bab132d9dd1aa132.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/shop/open-bd6354f3da40c549.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/terms-32de9d06ea88048e.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/transaction-a9f7cb8f9147da95.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/transaction/%5Bid%5D-6fea6a3de826cc84.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/user/auth/login-f9e1f96f59429357.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/user/auth/register-2064fe2155ce4bdd.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/user/edit-3c7b462d06feea9a.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/pages/user/manage-2fb8df6e44678d37.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/chunks/webpack-5752944655d749a0.js",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/_next/static/css/2f7dc07ffc5f94e0.css",revision:"ToVuoTGLhl_c4G6LzK-aX"},{url:"/asset/anonymous.png",revision:"41361a415d0c0ad25eb99e3cda4eecf0"},{url:"/asset/background-1.jpg",revision:"27988ffce0b610f67d243fe20563f9cb"},{url:"/asset/badge/bronze.png",revision:"795e48a6c10780b99124aae89746b247"},{url:"/asset/badge/diamond.png",revision:"878f6aafcc10cafeab09765933437b12"},{url:"/asset/badge/gold.png",revision:"e474b0d72a4eccb62138d71ff6549778"},{url:"/asset/badge/silver.png",revision:"fc5adcbea701377c92bc7e4319bbec30"},{url:"/asset/default_toped.jpg",revision:"026798a969c53db51bb39bc6cd781c6a"},{url:"/asset/footer.jpg",revision:"eafa3d908720becf17b85f4aa91c85c6"},{url:"/asset/icon/icon192.png",revision:"7512e284a7e23111224e09e26997baf8"},{url:"/asset/icon/icon512.png",revision:"57006d8c0e242c71990fba8103207c22"},{url:"/asset/logo.png",revision:"4dd8ec406ac8fae01eeaadd01f625b18"},{url:"/asset/no-image.png",revision:"c0c008e20dea607bbd4eaaedaf1efb6c"},{url:"/asset/promo/1.webp",revision:"997540dd760e3531b8efce5df7a6fe49"},{url:"/asset/promo/2.webp",revision:"cc604eef2352fa435dcb6e8deca8f0f1"},{url:"/asset/promo/3.jpg",revision:"1e5dabf11db9579615af97495810ae48"},{url:"/asset/promo/4.jpg",revision:"d0b47c7a500dc6e662a66c27d4297695"},{url:"/asset/seller_no_logo.png",revision:"ad0e6a944a34bb522ab1547b9cd689c9"},{url:"/asset/shopnophoto.png",revision:"aa382d41e14f57ab67941a98b8cadcd7"},{url:"/asset/test.jpg",revision:"d7b9dc43fd5d3ecdf1732879d1fb4953"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/manifest.json",revision:"252dae47f335e02bd474258294770a4b"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
