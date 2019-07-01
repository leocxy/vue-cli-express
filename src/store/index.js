'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify/lib'
import Axios from 'axios'
import _ from 'lodash'
import 'vuetify/src/stylus/app.styl'
import VeeValidate from 'vee-validate'

// Using lodash
Vue.prototype._ = _
// Using Axios as http client
Vue.prototype.$http = Axios;
// Using Vuex for global variables manager
Vue.use(Vuex)
// Validator
Vue.use(VeeValidate)
// Vuetify
Vue.use(Vuetify, {
	// theme: {
	// 	primary: "#ee44aa",
	// 	secondary: '#424242',
	// 	accent: '#82B1FF',
	// 	error: '#FF5252',
	// 	info: '#2196F3',
	// 	success: '#4CAF50',
	// 	warning: '#FFC107'
	// },
	options: {
		customProperties: true
	},
	iconfont: 'fa',
});

let store = new Vuex.Store({
	state: {
		app_url: process.env.VUE_APP_URL,
		rest_api: [
			{name: 'valid', url: process.env.VUE_APP_URL + '/api/shopify/valid'},
			{name: 'shop_info', url: process.env.VUE_APP_URL + '/api/shop/info'}
		],
		snackbar: {
			show: false,
			message: 'Here is test snackbar'
		},
	},
	getters: {},
	mutations: {
		toggleSnackbar(state, obj) {
			if (_.isBoolean(obj)) {
				return state.snackbar.show = obj
			}
			state.snackbar = Object.assign(state.snackbar, obj);
		}
	},
	actions: {}
});

export default store