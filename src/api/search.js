// 搜索组件相关的api函数

// 导入axios
import request from '@/utils/request.js'

// 1.获取“联想关键字”的api
// q:用户输入的关键字
export function apiSearchSuggestion (q) {
  return request({
    url: '/app/v1_0/suggestion',
    nethod: 'get',
    params: {
      q
    }
  })
}
