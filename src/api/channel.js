// 封装获取频道的api函数

// 导入axios对象(即：封装号的request)
import request from '@/utils/request.js'

// 导入store(Vuex)，可以判断用户是否登录系统 store.state.user.token?'登录':'未登录'
import store from '@/store/index.js'

// 本地持久化存储频道设置的key(游客 和 登录用户 分别设置)
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key

// 1.导出一个封装好的获取频道数据的api函数
// 应用端明确要求如下函数返回"Promise对象"结果
// 给函数前边设置async，那么这个函数return返回结果以"Promise对象"形式体现
export async function apiChannelList () {
  // 对代码做升级处理，以实现数据的本地持久化
  // A. 从缓存localStorage里边获得频道(注意区分用户是否有登录系统)

  // 根据用户是否登录系统获得对应的localStorage操作的key
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL

  // 读取缓存的频道数据:null | 实体字符串
  // 频道数据在localStorage中存储的样子：[{id:xx,name:xx},{id:xx,name:xx},{id:xx,name:xx},……]
  // 是“数组对象集”，但是类型是字符串
  const cachechannels = localStorage.getItem(key)

  // B. 判断是否有缓存频道数据
  if (cachechannels) {
    // 有数据，直接返回应用
    return { channels: JSON.parse(cachechannels) }
  } else {
    // 没有数据，就走axios获得数据应用
    // 注意：request前边需要设置await，保证同步执行，后续代码可以正常获得res结果
    const res = await request({
      url: '/app/v1_0/user/channels',
      method: 'get'
    })
    // 把获得好的数据存储给localStorage，以便下次使用
    localStorage.setItem(key, JSON.stringify(res.channels))
    // 数据对外输出应用即可
    return res
  }

  // return:返回axios执行的结果
  // return request({
  //   url: '/app/v1_0/user/channels',
  //   method: 'get'
  // })
}

// 2.导出一个获取“全部频道”数据的api函数
export function apiChannelAll () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}

// 3.导出一个向 我的频道 做 添加 频道的api函数
// 添加频道时,需将该频道的信息作为参数进行传递  channel {id:xx, name:xx}
// async:可以单独使用  await:必须和async搭配使用
export async function apiChannelAdd (channel) {
  // 根据用户是否登录系统,获得对应的localStorage操作的key
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL

  // 若是登录状态，就将存储的数据获取出来
  const cachechannels = JSON.parse(localStorage.getItem(key))

  // 向上述的数据集中添加要添加的频道数据
  cachechannels.push(channel)

  // 再将已经做完添加操作的数组集存储到本地localStorage里
  localStorage.setItem(key, JSON.stringify(cachechannels))

  // 通过 return 返回一个 Promise对象,方便应用端使用该api函数
  // 因为不需要返回一个具体的数据，所以返回一个null即可
  return null
}

// 4. 频道删除的api函数
// 添加删除时,需将该频道的信息作为参数进行传递  channel {id:xx, name:xx}
export async function apiChannelDel (channel) {
  // A.根据用户是否登录系统,获得对应的localStorage操作的key
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL

  // B.若是登录状态，就将存储的数据获取出来
  const cachechannels = JSON.parse(localStorage.getItem(key))

  // C.对拥有的频道做删除操作，从cacheChannels里边去除channel项目
  // 通过使用数组的filter()方法来实现，返回被过滤掉的数据
  // 即：返回，不包括 已经删除的频道 的全部频道数据
  const tmpChannels = cachechannels.filter(item => {
    return item.id !== channel.id // channel:就是被删除的频道数据
  })

  // D.将已经过滤完成的数据再存储到本地了
  localStorage.setItem(key, JSON.stringify(tmpChannels))

  // E.通过 return 返回一个 Promise对象,方便应用端使用该api函数
  // 因为不需要返回一个具体的数据，所以返回一个null即可
  return null
}
