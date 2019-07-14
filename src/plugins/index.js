'use strict'
import Axios from './axios'
import Lodash from './lodash'
import Vuetify from './vuetify'

export default {
	install: (Vue) => {
		Vue.use(Axios);
		Vue.use(Lodash);
		Vue.use(Vuetify);
	}
}