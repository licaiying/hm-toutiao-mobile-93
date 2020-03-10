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
    searchText: async function (newV) {
      // 用户没有输入信息不要联想
      if (!newV) {
        // 去除旧的联想数据
        this.suggestionList = []
        return false
      }

      // 正常联想
      const result = await apiSearchSuggestion(newV)
      // console.log(result) // {options: Array(5)}
      this.suggestionList = result.options
    }
  }
}
</script>

<style scoped lang='less'></style>
