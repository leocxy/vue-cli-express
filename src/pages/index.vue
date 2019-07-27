<template>
<v-container fluid fill-height>
	<v-layout align-center justify-center>
		<v-flex xs12 sm8 md4>
			<v-card class="elevation-12">
				<v-toolbar dark color="secondary">
					<v-toolbar-title>Public App Title</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form lazy-validation ref="form">
						<div>Post Data: {{ post }}</div>
						<v-text-field v-model="form.text"
							prepend-icon="fa fa-text"
							name="post_text"
							label="The text you want to post to backend"
							type="text"
							v-validate="getRules('post_text')"
							v-on:keydown.enter.prevent="postData"
							:error-messages="errors.collect('post_text')"
							data-post_text
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="validate()">Send</v-btn>
					<v-btn color="default" @click="getShop()">Get Shop</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
	</v-layout>
</v-container>
</template>

<script>
import mixins from '../utils/mixins'
import { mapMutations } from 'vuex'

export default {
	name: 'home',
	mixins: [mixins],
	data: () => ({
		form: {
			text: '',
		},
		rules: {
			post_text: 'required'
		},
		post: 'Wait for response',
	}),
	mounted() {
		this.$validator.localize('en');
	},
	methods: {
		getShop: function() {
			this.$http.get(this.$store.getters.getApi('shop_info')).then((res) => {
				this.toggleSnackbar({show: true, message: res.data.domain });
			}).catch((e) => {
				throw Error("Something went wrong", e)
			});
		},
		postData: function() {
			this.$http.post(this.$store.getters.getApi('shop_info'), this.form).then((res) => {
				this.toggleSnackbar({show: true, message: 'Posted!'});
				this.post = res.data.post.text;
			}).catch((e) => {
				throw Error("Something went wrong", e)
			});
		},
		validate: function() {
			this.$validator.validateAll().then(valid => {
				if (valid) {
					this.postData()
				}
			});
		},
		...mapMutations(['toggleSnackbar'])
	}
}
</script>