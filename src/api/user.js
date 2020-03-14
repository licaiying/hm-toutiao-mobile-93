// 导入已经配置好的axios函数对象
// request就是经过各种初始配置的axios对象，可以直接使用
import request from '@/utils/request.js'

// 1.导出一个函数，可以对用户账号进行校验
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

// 2.关注作者的api函数
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

// 3.取消关注的api函数
// target:被取消关注作者的id
export function apiUnFollow (target) {
  return request({
    url: '/app/v1_0/user/followings/' + target,
    method: 'delete'
  })
}

// 4.个人中心：获得用户基本信息的api函数
// 接口：【获取用户自己信息】
export function apiUserInfo () {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
  })
}

// 5.获取用户个人资料的api函数
// 接口：【获取用户个人资料】
/**
 * 编辑资料：获得用户的资料信息，用于修改
 * 内部自动传递token，可以识别当前的用户
 */
export function apiUserProfile () {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'get'
  })
}

// 6.上传用户头像的api
// 接口：【编辑用户照片资料（头像、身份证照片）】
/**
 * 对用户头像进行更新
 * patch：代表对众多的字段中"几个"来更新
 * put: 对"全部"字段做更新
 * 参数的类型：file {FormData对象，里边有附件信息，photo代表头像}
 * @param fdObj
 */
export function apiUserPhoto (fdObj) {
  return request({
    url: '/app/v1_0/user/photo',
    method: 'patch',
    data: fdObj
  })
}

// 7.编辑用户个人资料
// 接口：【编辑用户个人资料（包含实名认证）】
/**
 * name: 昵称  string
 * gender:  性别，0-男，1-女
 * birthday: 生日，格式'2018-12-20'
 * 注意：photo头像不用处理，上传的时候都处理好了
 */
export function apiUserSaveProfile ({ name, gender, birthday }) {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'patch',
    data: {
      name,
      gender,
      birthday
    }
  })
}
