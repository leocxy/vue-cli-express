import { shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from "flush-promises"
// Used Plugin/Lib
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
// Vuex
import getters from '@/store/getters'
import state from '@/store/state'
// Test Component
import App from '@/pages/index.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)
localVue.use(VeeValidate)

let url, data;

const mockHttp = {
	get: (_url, _data) => {
		return new Promise((resolve, reject) => {
			url = _url
			data = _data
			resolve({data: {domain: 'test.com'}})
		})
	},
	post: (_url, _data) => {
		return new Promise((resolve, reject) => {
			url = _url
			data = _data
			resolve({data: {post: _data}})
		})
	}
}

describe('pages/index.vue', () => {
	let store

	beforeEach(() => {
		store = new Vuex.Store({
			state,
			getters
		})
	})

	it('Check Default Data', () => {
		const wrapper = shallowMount(App, {store, localVue})
		expect(wrapper.vm.$data.post).toEqual('Wait for response')
		expect(wrapper.vm.$data.rules).toEqual({post_text: 'required'})
		expect(wrapper.vm.$data.form).toEqual({text: ''})

	})

	it('Method: getShop - pass', async() => {
		const wrapper = shallowMount(App, {
			mocks: {$http: mockHttp},
			store, localVue
		})

		wrapper.setMethods({toggleSnackbar: () => ({})})

		wrapper.vm.getShop()

		await flushPromises()

		expect(url).toBe(process.env.VUE_APP_URL + '/api/shop/info')
	})

	it('Method: postShop - pass', async() => {
		const wrapper = shallowMount(App, {
			mocks: {$http: mockHttp},
			store, localVue
		})

		wrapper.setMethods({toggleSnackbar: () => ({})})

		wrapper.vm.$data.form.text = 'test';

		wrapper.vm.postData()

		await flushPromises()

		expect(url).toBe(process.env.VUE_APP_URL + '/api/shop/info')
		expect(wrapper.vm.$data.post).toEqual('test')
	})
})