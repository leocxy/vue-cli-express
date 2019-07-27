'use strict'
export default {
	getApi: (state) => (name) => {
		let rs = state.rest_api.find(v => v.name == name) || {url: '/'}
		return rs.url;
	}
}