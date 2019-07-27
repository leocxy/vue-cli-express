'use strict'
export default {
	app_url: process.env.VUE_APP_URL,
	rest_api: [
		{name: 'valid', url: process.env.VUE_APP_URL + '/api/shopify/valid'},
		{name: 'shop_info', url: process.env.VUE_APP_URL + '/api/shop/info'}
	],
	snackbar: {
		show: false,
		message: 'Here is test snackbar'
	},
}