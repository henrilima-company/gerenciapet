module.exports = {
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
}