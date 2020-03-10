<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- 搜索框区域 -->
    <!-- v-model: 双向数据绑定，感知/设置 输入框的相关内容 -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词" />
    <van-cell-group>
      <van-cell v-for="(item,k) in suggestionList" :key="k" :title="item" icon="search" />
    </van-cell-group>
  </div>
</template>

<script>
// 导入获取“联想关键字”的api
import { apiSearchSuggestion } from '@/api/search.js'

export default {
  name: 'search-index',
  data () {
    return {
      searchText: '', // 用户输入的搜索关键字
      suggestionList: [] // 联想建议数据
    }
  },

  // 设置watch监听器，以监听 搜索框中 用户输入的内容子段，以此来实现联想关键字的匹配
  watch: {
    searchText: function (newV) {
      // 该监听器每次进来的时候，首先清除 this.timer（就是setTimeout停止）定时器
      // 通过定时器，清除的是输入两个字符时，之间相隔的时间差
      clearTimeout(this.timer)

      // 用户没有输入信息不要联想
      if (!newV) {
        // 去除旧的联想数据
        this.suggestionList = []
        return false
      }

      // 通过定时器实现 防抖
      // 防抖技术要介入
      // 对setTimeout的返回结果进行接收，以便可以中断其执行
      // 会返回"整型数字"信息
      // 给当前组件临时声明一个timer的临时成员，这个成员不用事先通过data声明
      // 组件运行期间都生效，使得就是唯一的timer被使用(即使事件被多次调用)
      // this.timer表示给 组件实例 动态增加一个data成员，临时使用的可以不用提前声明
      this.timer = setTimeout(async () => {
        // 正常联想
        const result = await apiSearchSuggestion(newV)
        // console.log(result) // {options: Array(5)}
        this.suggestionList = result.options
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'></style>
