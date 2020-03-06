// 封装获取频道的api函数

// 导入axios对象(即：封装号的request)
import request from '@/utils/request.js'

// 到出一个封装好的获取频道数据的api函数
export function apiChannelList () {
  // return:返回axios执行的结果
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
}
