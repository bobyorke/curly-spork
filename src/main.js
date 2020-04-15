import Vue from 'vue';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

import axios from 'axios';

import App from './App.vue';
import router from './router';

Vue.prototype.$axios = axios;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
