'use strict'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
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
	getters: {
		getApi: (state) => (name) => {
			let rs = state.rest_api.find(v => v.name == name) || {url: '/'}
			return rs.url;
		}
	},
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