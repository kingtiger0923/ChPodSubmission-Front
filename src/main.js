import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from 'axios';
import VueAxios from 'vue-axios';
import { store } from './store/store';

Vue.use(VueAxios, axios);
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';
import "bootstrap/dist/css/bootstrap.min.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
