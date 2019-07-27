import { shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from "flush-promises"
// Used Plugin/Lib
import Vuetify from 'vuetify';
import Vuex from 'vuex'
// Vuex
import getters from '@/store/getters'
import state from '@/store/state'
// Test Component
import App from '@/App.vue'
import Home from '@/pages/index.vue'
import Install from '@/pages/install.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)

let url, data, data_state = 0
const mockHttp = {
	get: (_url, _data) => {
		return new Promise((resolve, reject) => {
			url = _url
			data = _data
			resolve({data: {state: data_state}})
		})
	}
}

describe('App.vue', () => {

	let store

	beforeEach(() => {
		store = new Vuex.Store({
			state,
			getters
		})
	})

	it('Check Defualt Data & Component', () => {
		const wrapper = shallowMount(App, {store, localVue})
		expect(wrapper.vm.$data.loading.isActive).toBe(false)
		expect(wrapper.vm.$data.currentView).toMatch('install')
	})

	it('Component Check', () => {
		const wrapper = shallowMount(App, {store, localVue})

		wrapper.vm.invalidStore()
		expect(wrapper.vm.$data.loading.isActive).toBe(false)
		expect(wrapper.vm.$data.currentView).toMatch('install')
		expect(wrapper.find(Install).exists()).toBe(true)
		expect(wrapper.find(Home).exists()).toBe(false)

		wrapper.vm.validStore()
		expect(wrapper.vm.$data.loading.isActive).toBe(false)
		expect(wrapper.vm.$data.currentView).toMatch('home')
		expect(wrapper.find(Install).exists()).toBe(false)
		expect(wrapper.find(Home).exists()).toBe(true)
	})

	it('Method: AjaxCheck - pass', async() => {
		const wrapper = shallowMount(App, {
			mocks: {$http: mockHttp},
			store, localVue
		})

		wrapper.vm.ajaxCheck()

		await flushPromises()

		expect(url).toBe(process.env.VUE_APP_URL + '/api/shopify/valid')
		expect(wrapper.vm.$data.currentView).toMatch('home')
		expect(wrapper.find(Home).exists()).toBe(true)
		expect(wrapper.find(Install).exists()).toBe(false)
	})

	it('Method: AjaxCheck - fail', async() => {
		const wrapper = shallowMount(App, {
			mocks: {$http: mockHttp},
			store, localVue
		})

		data_state = 1
		wrapper.vm.ajaxCheck()
		await flushPromises()

		expect(url).toBe(process.env.VUE_APP_URL + '/api/shopify/valid')
		expect(wrapper.vm.$data.currentView).toMatch('install')
		expect(wrapper.find(Home).exists()).toBe(false)
		expect(wrapper.find(Install).exists()).toBe(true)
	})
})