<template>
  <div class="container">
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />
  </div>
</template>

<script>
// 导入获取搜索结果的api函数
import { apiSearchList } from '@/api/search.js'

export default {
  name: 'search-result',
  data () {
    return {
      searchList: [] // 搜索结果列表数据
    }
  },
  created () {
    this.getSearchList()
  },
  methods: {
    // ，调用api，获取搜索结果
    async getSearchList () {
      const result = await apiSearchList({ q: this.$route.params.keyword })
      this.searchList = result.results
    }
  }
}
</script>

<style scoped lang='less'></style>
