module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "ScanditSDK",
      externals: {
        react: "React"
      }
    }
  },
  webpack: {
    html: {
      template: "demo/src/example.html"
    }
  }
}
