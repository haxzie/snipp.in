import Vue from 'vue';
import App from './App.vue'
import './styles/global.scss'
import WebFont from 'webfontloader';


WebFont.load({ google: { families: ["Inter", "Fira Code"] } });
new Vue({
    el: "#app",
    render: h => h(App)
})