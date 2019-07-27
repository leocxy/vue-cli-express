'use strict'

export default {
	toggleSnackbar(state, obj) {
		if ("boolean" === typeof obj) {
			return state.snackbar.show = obj
		}
		state.snackbar = Object.assign(state.snackbar, obj);
	}
}