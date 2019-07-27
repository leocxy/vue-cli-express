<template>
<v-app id="inspire">
	<loading
		:active.sync="loading.isActive"
		:can-cancel="loading.canCancel"
		:is-full-page="loading.fullPage"
		:width="loading.width"
		:height="loading.height"
		:color="loading.color" ></loading>

	<component :is="currentView"></component>

	<v-snackbar v-model='show'>
		{{ msg }}
		<v-btn flat color="accent" @click.native="toggleSnackbar(!show)">Close</v-btn>
	</v-snackbar>
</v-app>
</template>

<script>
import mixins from './utils/mixins'
import { mapState, mapMutations } from 'vuex'

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css'

import Home from './pages/index.vue'
import Install from './pages/install.vue'
export default {
	name: 'app',
	mixins: [mixins],
	data() {
		return {
			loading: {
				isActive: true,
				fullPage: true,
				color: '#007bff',
				width: 128,
				height: 128,
				opacity: '0.5',
				transition: 'fade',
				zindex: 999,
				loader: 'spinner',
				canCancel: false,
			},
			currentView: 'install'
		}
	},
	computed: {
		show: {
			get: function() { return this.$store.state.snackbar.show },
			set: function(v) { this.toggleSnackbar(v)}
		},
		...mapState({
			msg: state => state.snackbar.message,
		})
	},
	methods: {
		validStore: function() {
			this.loading.isActive = false;
			this.currentView = 'home';
		},
		invalidStore: function() {
			this.loading.isActive = false;
			this.currentView = 'install';
		},
		ajaxCheck: function() {
			// valid request from backend
			this.$http.get(this.$store.getters.getApi('valid') + window.self.location.search).then((res) => {
				let data = res.data;
				if (data.state) {
					this.invalidStore();
				} else {
					this.validStore();
				}
			}).catch((e) => {
				this.invalidStore();
				throw Error("Something went wrong", e)
			});
		},
		...mapMutations(['toggleSnackbar'])
	},
	mounted() {
		// Check Open from shopify embedded app or not
		if (window.self != window.top) {
			this.ajaxCheck()
		} else {
			this.invalidStore();
		}
	},
	components: {Home, Install, Loading},
}
</script>
