// 封装获取文章数据的api函数

// 导入axios(即:封装好的request函数)
import request from '@/utils/request.js'

// 1.导出一个获取文章数据的函数
// 参数以解构的形式呈现，方便查看
export function apiArticleList ({ channel_id, timestamp }) {
  // return 的就是axios执行的结果
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params: {
      channel_id, // 频道的id
      timestamp, // 获取当前文章时的时间戳
      with_top: 1 // 是否包含置顶文章  1:表示包含
    }
  })
}

// 2.导出一个对“不感兴趣文章”的处理api函数
export function apiArticleDislike (articleID) {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target: articleID
    }
  })
}

// 3.导出一个“举报文章”的api函数
export function apiArticleReport ({ articleID, type, remark = '' }) {
  return request({
    url: '/app/v1_0/article/reports',
    method: 'post',
    data: {
      target: articleID,
      type,
      remark
    }
  })
}

// 4.获取文章详情的api函数
// 需要以文章的id作为参数
export function apiArticleDetail (articleID) {
  return request({
    method: 'get',
    url: '/app/v1_0/articles/' + articleID
  })
}
