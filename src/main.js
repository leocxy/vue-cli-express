// Vue
import Vue from 'vue';
// Vue Template
import App from './App.vue';
import router from './router/'
import store from './store/'
// plugins
import plugins from './plugins/'
Vue.use(plugins)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
