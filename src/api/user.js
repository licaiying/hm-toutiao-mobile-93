// 导入已经配置好的axios函数对象
// request就是经过各种初始配置的axios对象，可以直接使用
import request from '@/utils/request.js'

// 导出一个函数，可以对用户账号进行校验
// data: {mobile:xx, code:xx} 对象参数
// 现在对data做升级，使得在没有任何注释信息的条件下，也直接知道当前api函数需要什么参数，提高开发效率
// 把参数做成是 “对象解构赋值” 的样子，这样就知道需要哪个参数了
// export function apiUserLogin (data) {
export function apiUserLogin ({ mobile, code }) {
  // 调用axios
  // axios.get()
  // axios.post()
  // axios({
  //   url:请求地址,
  //   method:'get/post',
  //   params:xx, // get方式传递参数
  //   data:xx  // post方式传递参数
  // })
  // return 调用当前函数，可以获得到请求结果
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data: {
      // 简易成员赋值
      mobile,
      code
    }
  })
}

// 关注作者的api函数
// target:被关注作者的id
export function apiFollow (target) {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'post',
    data: {
      target
    }
  })
}

// 取消关注的api函数
// target:被取消关注作者的id
export function apiUnFollow (target) {
  return request({
    url: '/app/v1_0/user/followings/' + target,
    method: 'delete'
  })
}

// 个人中心：获得用户基本信息的api函数
// 接口：【获取用户自己信息】
export function apiUserInfo () {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
  })
}
