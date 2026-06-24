const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8082,
    client: {
      overlay: {
        runtimeErrors: (error) => {
          if (error.message && error.message.includes('ResizeObserver')) return false
          return true
        }
      }
    }
  }
})
