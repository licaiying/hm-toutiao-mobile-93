import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入配置font-size的基准值文件
import 'amfe-flexible/index.min.js'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
