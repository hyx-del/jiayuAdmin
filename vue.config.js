"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "Admin";

// dev port
const port = process.env.port || process.env.npm_config_port || 9000;

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false, // 关闭生产环境的sourcemap
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // 配置反向代理
    proxy: {
      "/admin": {
        // 以/ajax开头的请求
        target: 'http://api.dev.jiayu.gold', //dev环境
        // target: 'http://api.test.jiayu.gold', //test环境
        // target: 'http://192.168.110.172:8085', //吴伟
        // target: 'http://192.168.110.48:8080', //刘中超
        // target: 'http://192.168.110.13:8080', //谢毅伦
        // target: 'http://192.168.110.112:8080', //蔡壮

        changeOrigin: true,
        // pathRewrite: {
        // 	'^/api': '/', // 需要重写就加上，不需要就不要加
        // },
      },
    },
    // before: require('./mock/mock-server.js'),
  },
  configureWebpack: {
    name: name,
    externals: {
      //前面插件名 后面定义全局引用变量名
      vue: "Vue",
      "element-ui": "ELEMENT",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-china-area-data": "element-china-area-data",
      "vue-video-player": "VueVideoPlayer",
      wangeditor: "wangeditor",
    },
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  chainWebpack(config) {
    console.log("加载环境：", process.env.ENV, process.env.NODE_ENV);
    config.plugins.delete("preload");
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // 只打包最初依赖的第三方
          },
          elementUI: {
            name: "chunk-elementUI", // 将elementUI拆分为单个包
            priority: 20, // 尺寸大于libs和app，否则它将被打包到libs或app中
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // 为了适应cnpm写法
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // 你的组件位置
            minChunks: 3, //  最低的数量
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
