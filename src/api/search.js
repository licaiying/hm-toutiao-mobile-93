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

// 2.展示搜索结果的api函数
// page：页数，不传默认为1
// per_page：每页数量，不传每页数量由后端决定
// q：是搜索关键词

export function apiSearchList ({ q, page = 1, perPage = 10 }) {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params: {
      q,
      page,
      per_page: perPage
    }
  })
}
