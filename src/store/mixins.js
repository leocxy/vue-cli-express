'use strict'

export default {
	methods: {
		getRestfulApi: function(name) {
			return this.$store.state.rest_api.find(v => v.name == name).url || '/'
		},
	}
}