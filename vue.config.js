module.exports = {
  pluginOptions: {
    express: {
      shouldServeApp: false,
      serverDir: './srv'
    }
  },
  devServer: {
    // You can active 
    disableHostCheck: true,
  	allowedHosts: [
  		'0.0.0.0',
  		'localhost',
      process.env.APP_ADDRESS
  	],
  	proxy: {
  		'/api': {
  			// You might need to change this if your change the package.json
  			target: 'http://localhost:3000',
  			changeOrigin: false,
  			pathRewrite: {
  				'^/api': '/'
  			}
  		}
  	}
  },
}
