import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "./styles/global.scss";
import WebFont from "webfontloader";
import simplebar from "simplebar-vue";
import 'simplebar-vue/dist/simplebar.min.css';
import vClickOutside from "v-click-outside";
import VTooltip from "v-tooltip";
import router from "./routes";
import './registerServiceWorker'
import Notifications from 'vue-notification'

Vue.component("simplebar", simplebar);
Vue.use(vClickOutside);
Vue.use(VTooltip);
Vue.use(require('vue-shortkey'));
Vue.use(Notifications)

WebFont.load({ google: { families: ["Inter", "Fira Code"] } });
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
