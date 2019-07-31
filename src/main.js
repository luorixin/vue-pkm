import Vue from 'vue'
import axios from 'axios';
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui';
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/index.scss';
import './directive';
import * as filters from './filters';

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.use(ElementUI, {
    size: 'small'
});

Vue.prototype.$axios = axios;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
