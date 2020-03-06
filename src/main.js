import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入配置font-size的基准值文件
import 'amfe-flexible/index.min.js'

// 导入全局样式控制文件
// 注意：在vant的css样式导入之后设置,目的是：为了覆盖vant的样式
import '@/assets/css/global.less'

// 导入校验规则注册文件，其不是模块，不用起名字接收，本质就是引入执行而已
import '@/utils/validate.js'

Vue.use(Vant)

// 【全局延迟器】
// 设置一个【全局延迟器】，是Vue的继承成员，名称为$sleep，就是"自定义"的
// 使得组件可以调用： this.$sleep() ,开始要做延迟执行
// time形参，表示等待时间，毫秒
Vue.prototype.$sleep = (time) => {
  // Promise对象返回：应用端可以介入await，这样异步过程变为同步过程，可以保证当前代码没有执行完毕，
  // 后续代码不要执行
  return new Promise((resolve) => {
    // setTimeout是设置具体延迟的
    setTimeout(() => {
      resolve() // resolve()是空执行，打酱油的
    }, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
