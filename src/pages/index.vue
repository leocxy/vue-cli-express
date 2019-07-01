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
							v-validate="'required'"
							v-on:keydown.enter.prevent="postData"
							:error-messages="errors.collect('post_text')"
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="postData()">Send</v-btn>
					<v-btn color="default" @click="getShop()">Get Shop</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
	</v-layout>
</v-container>
</template>

<script>
import mixins from '../store/mixins'
import { mapState, mapMutations } from 'vuex'

export default {
	name: 'home',
	mixins: [mixins],
	data: () => ({
		valid: true,
		form: {
			text: '',
		},
		post: 'Wait for response',
	}),
	mounted() {
		this.$validator.localize('en');
	},
	methods: {
		getShop: function() {
			this.$http.get(this.getRestfulApi('shop_info')).then((res) => {
				this.toggleSnackbar({show: true, message: 'Get Shop Info'});
			}).catch((err) => {
				console.error(err);
			});
		},
		postData: function() {
			this.$validator.validateAll().then(valid => {
				if (valid) {
					this.$http.post(this.getRestfulApi('shop_info'), this.form).then((res) => {
						this.toggleSnackbar({show: true, message: 'Posted!'});
						this.post = res.data.post.text;
					}).catch((err) => {
						console.error(err);
					});
				}
			});
		},
		...mapMutations(['toggleSnackbar'])
	}
}
</script>