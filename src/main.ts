import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/styles/global.less';

Vue.config.productionTip = false

console.log(process.env.NODE_ENV);
console.log(process.env.VUE_APP_URL);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
