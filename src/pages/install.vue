<template>
<v-container fluid fill-height>
	<v-layout align-center justify-center>
		<v-flex xs12 sm8 md4>
			<v-card class="elevation-12">
				<v-toolbar dark color="primary">
					<v-toolbar-title>Public App Title</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form lazy-validation ref="form">
						<v-text-field 
							prepend-icon="fa fa-store"
							v-model="form.url"
							name="store_url"
							label="your-store.myshopify.com"
							type="text"
							v-validate="getRules('store_url')"
							v-on:keydown.enter.prevent="install"
							:error-messages="errors.collect('store_url')"
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="install()">Install</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
	</v-layout>
</v-container>
</template>

<script>
import mixins from '../utils/mixins.js';

export default {
	name: 'install',
	mixins: [mixins],
	data: () => ({
		form: {
			url: '',
		},
		rules: {
			store_url: {required: true, regex: /(.*).myshopify.com$/ }
		}
	}),
	mounted() {
		this.$validator.localize('en');
	},
	methods: {
		install: function() {
			this.$validator.validateAll().then(valid => {
				if (valid) {
					// redirect to install url
					let url = this.$store.state.app_url + '/api/shopify?shop=' + this.form.url;
					window.location.href = url;
				}
			});
		},
	}
}
</script>

<style lang="scss" scoped>
.install-block {
	height: 500px;
	margin-top: 120px;
	.install-panel {
		background-color: #000;
		width: 200px;
		height: 200px;
	}
}
</style>