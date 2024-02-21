/* const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // 修改输出目录和public path
      paths.appBuild = path.join(path.dirname(paths.appBuild), "build");
      webpackConfig.output = {
        ...webpackConfig.output,
        // 此处设置你的静态资源路径前缀
        publicPath: process.env.NODE_ENV === "production" ? "/www/demo/" : "/",
      };
      return webpackConfig;
    },
  },
};
 */
