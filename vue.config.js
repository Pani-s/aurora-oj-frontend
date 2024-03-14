const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config) {
    config.plugin("monaco").use(new MonacoWebpackPlugin());
  },
  // css: {
  //   // css预设器配置项
  //   loaderOptions: {
  //     less: {
  //       // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
  //       modifyVars: {
  //         // 初始化可直接覆盖变量
  //         "arcoblue-6": "#f85959",
  //         // "primary-color": "#dbbef6",
  //         // "text-color": "#111",
  //         // "border-color": "#eee",
  //         // "nice-blue": "#f0f",
  //       },
  //       javascriptEnabled: true,
  //     },
  //   },
  // },
});
