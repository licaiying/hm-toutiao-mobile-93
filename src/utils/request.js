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

// 3.配置【请求拦截器】(在请求头中携带token)
instance.interceptors.request.use(function (config) {
  // 判断token存在再做配置(vuex判断)
  // store.user.token 根据是否有值，就知道用户是否登录系统
  if (store.state.user.token) {
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, function (error) {
  // 响应失败
  return Promise.reject(error)
})

// 4.配置【响应拦截器】(处理token失效)
instance.interceptors.response.use(function (res) {
  // 正常响应处理
  // 确认服务器端返回的数据：返回data或返回data.data
  // const result = await axios()
  // this.xxx = result
  try {
    // data.data如果报错，没有获得到，错误信息会被catch步骤，就走data了
    return res.data.data
  } catch (err) {
    return res.data
  }
}, async function (error) {
  // 非正常响应处理(包括401)
  // console.dir(error) // 对象： config request response isAxiosError toJSON
  if (error.response.status === 401) {
    // refresh_token去营救token
    // 1. 判断refresh_token如果也没有，强制登录
    if (!store.state.user.refresh_token) {
      router.push('/login')
      // return 停止后续代码执行
      return new Promise(function () { }) // 返回空壳的对象，不要报任何错误
    }

    // 2. refresh_token存在，就携带者，发送新的axios请求，去营救token
    // 如果此时服务器端的refresh_token已经失效了(14天过了)，同样返回401，就强制登录
    // 所以要给下述代码设置try/catch，捕捉401并处理
    try {
      const result = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        // 配置请求头信息
        headers: {
          // 配置refresh_token
          Authorization: 'Bearer ' + store.state.user.refresh_token
        }
      })
      // console.log(result)  // 营救好的token  result.data.data.token

      // 客户端对新的token进行维护，vuex维护，token和refresh_token必须同时维护
      store.commit('updateUser', {
        token: result.data.data.token,
        refresh_token: store.state.user.refresh_token
      })

      // 把刚刚401失败的请求再重新发送一次
      // error.config：拥有失败请求的相关信息 {url,method,data等等}
      // 该信息正好可以满足axios应用
      // console.dir(error)  // {url,method,data等等}
      // instance是拥有许多配置信息的axios对象
      return instance(error.config)
      // return false
    } catch (err) {
      // 清除无效的refresh_token
      store.commit('clearUser')

      // token不ok(token在服务器端已经失效了，2个小时时效)
      // 强制用户重新登录系统，以刷新服务器端的token失效
      router.push('/login')
      // 不要给做错误提示了
      return new Promise(function () { }) // 空的Promise对象，没有机会执行catch，进而不做错误提示了
    }
  }

  // return new Promise((resolve,reject)=>{
  //    reject('获得文章失败！')
  // })
  return Promise.reject(error)
})

// 导出封装好的axios
export default instance
