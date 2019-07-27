import { shallowMount, createLocalVue } from '@vue/test-utils'
// Third Part Library
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
// Vuex
import getters from '@/store/getters'
import state from '@/store/state'
// Test Component
import App from '@/pages/install.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)
localVue.use(VeeValidate)

describe('pages/install.vue', () => {
	let store

	beforeEach(() => {
		store = new Vuex.Store({
			state,
			getters
		})
	})

	it('Check Default Data', () => {
		const wrapper = shallowMount(App, {store, localVue})
		expect(wrapper.vm.$data.form).toEqual({url: ''});
	})
})