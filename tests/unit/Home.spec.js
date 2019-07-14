import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
import App from '@/pages/install.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)
localVue.use(VeeValidate)

describe('pages/install.vue', () => {
	let store, state = {
		snackbar: {
			show: false,
			message: 'Hello'
		},
	}, actions = {
		toggleSnackbar: jest.fn()
	}

	beforeEach(() => {
		store = new Vuex.Store({
			state,
			actions,
		})
	})

	it('check default data', () => {
		const wrapper = shallowMount(App, {store, localVue})
		expect(wrapper.vm.$data.form).toEqual({url: ''});
	})

	it('check rules', () => {
		const wrapper = shallowMount(App, {store, localVue})
		expect(typeof wrapper.vm.$data.form).toMatch('object');
	})
})