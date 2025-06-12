const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://myanimelist.net",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/mangalist",
      },
    })
  );
};
