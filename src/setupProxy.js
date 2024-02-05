// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/www/wb/",
    createProxyMiddleware({
      target: "http://192.168.0.229:9001",
      changeOrigin: true,
    })
  );
};
