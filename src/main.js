import Vue from 'vue';
import App from './App.vue'
import store from "./store"
import './styles/global.scss'
import WebFont from 'webfontloader';


WebFont.load({ google: { families: ["Inter", "Fira Code"] } });
new Vue({
    // router,
    store,
    render: (h) => h(App),
  }).$mount("#app");