import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/styles/global.less';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

console.log(process.env.NODE_ENV);
console.log(process.env.VUE_APP_URL);
console.log(process.env.VUE_APP_BAIDU_AK);

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
