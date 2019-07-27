'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import state from './state.js'
import mutations from './mutations.js'

Vue.use(Vuex);

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions: {}
});