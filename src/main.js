import Vue from 'vue';
import App from './App.vue'
import store from "./store"
import './styles/global.scss'
import WebFont from 'webfontloader';
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import vClickOutside from 'v-click-outside';

Vue.component('simplebar', simplebar);
Vue.use(vClickOutside);

WebFont.load({ google: { families: ["Inter", "Fira Code"] } });
new Vue({
    // router,
    store,
    render: (h) => h(App),
  }).$mount("#app");