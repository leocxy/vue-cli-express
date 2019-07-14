'use strict'
import Axios from 'axios'

export default {
	install: (Vue) => {
		Vue.prototype.$http = Axios
	}
}