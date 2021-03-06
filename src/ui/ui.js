import Vue from 'vue';

import VueSweetalert2 from 'vue-sweetalert2';
import App from './App.vue';
import store from './store';
import './ui.scss';

Vue.use(VueSweetalert2);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
