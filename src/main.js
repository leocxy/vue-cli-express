// Vue
import Vue from 'vue';
// Vue Template
import App from './App.vue';
// plugins
import router from './router/'
import store from './store/'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
