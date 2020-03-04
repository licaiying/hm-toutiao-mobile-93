// 封装axios，并进行相关的配置

// 导入axios
import axios from 'axios'

// 导入处理JS的最大整型数值问题
import JSONBig from 'json-bigint'

// 导入store(vuex)，用于获取用户信息
// $store.state.user 获取用户信息
// $store.commit(xx,yy) 调用mutations方法
// $store.dispatch(xx,yy) 调用actions方法
import store from '@/store/index.js'

// 导入路由，实现路由的跳转功能
// router.push(xx)
import router from '@/router/index.js'

// 创建一个axios实例 和原来的axios没有关系
// create()调用完毕会返回一个"新的axios对象"(instance接收)
// "新的axios对象" 与原生的axios没有任何关系
// 给instance做各种配置应用，原生的axios对象不会做任何"污染"
// 这样不影响原生axios对象在其他场合的应用
// instance.defaults.baseURL=xxx,
// instance.defaults.transformResponse=[]
const instance = axios.create({
  // 1.配置请求的基地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 2.配置超大整形数字转换器
  transformResponse: [function (data) {
    // 服务器端返回的数据是字符串，可能有两种情况
    // (1). 实体字符串 "{name:value,name:value,name:value}""
    // (2). 空壳字符串 ""  这样的空字符串JSONBig.parse()处理不了，就报错了，catch会捕获并做处理

    // if (data) {
    //     return JSONBig.parse(data)
    // } else {
    //     return data
    // }

    // 将以上代码，更新如下：
    try {
      // 捕捉成功
      return JSONBig.parse(data)
    } catch (err) {
      // 捕捉失败
      return data
    }
  }]
})

// 导出封装好的axios
export default instance
