import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify';
import Vuex from 'vuex'
import App from '@/App.vue'
import Home from '@/pages/index.vue'
import Install from '@/pages/install.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)

describe('App.vue', () => {

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

	it('default show install page', () => {
		const wrapper = shallowMount(App, {store, localVue})
		expect(wrapper.vm.$data.loading.isActive).toBe(false)
		expect(wrapper.vm.$data.currentView).toMatch('install')
	})

	it('Check Valid & Invalid Display', () => {
		const wrapper = shallowMount(App, {store, localVue})
		wrapper.vm.validStore()
		expect(wrapper.vm.$data.loading.isActive).toBe(false)
		expect(wrapper.vm.$data.currentView).toMatch('home')
		expect(wrapper.find(Home).exists()).toBe(true)
		expect(wrapper.find(Install).exists()).toBe(false)

		wrapper.vm.invalidStore()
		expect(wrapper.vm.$data.loading.isActive).toBe(false)
		expect(wrapper.vm.$data.currentView).toMatch('install')
		expect(wrapper.find(Install).exists()).toBe(true)
		expect(wrapper.find(Home).exists()).toBe(false)
	})
})