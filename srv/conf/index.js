'use strict'
// Global varaibles
module.exports = {
	apiKey: process.env.SHOPIFY_API_KEY,
	apiSecret: process.env.SHOPIFY_API_SECRET,
	scopes: process.env.APP_SCOPES,
	redirect_uri: process.env.APP_ADDRESS,
	version: process.env.API_VERSION,
	devStore: process.env.DEV_STORE,
}