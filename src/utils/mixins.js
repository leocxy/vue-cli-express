'use strict'

export default {
	methods: {
		getRules: function(field) {
			return this.rules[field] || ''
		}
	}
}