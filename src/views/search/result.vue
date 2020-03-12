<template>
  <div class="container">
    <!-- fixed：是否固定在顶部 是van-nav-bar组件提供的API-->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 文章列表展示区域，瀑布流效果 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script>
// 导入获取搜索结果的api函数
import { apiSearchList } from '@/api/search.js'

export default {
  name: 'search-result',
  data () {
    return {
      searchList: [], // 搜索结果列表数据

      list: [],
      loading: false, // 瀑布流加载时的动画
      finished: false // 瀑布流加载完成时的动画
    }
  },
  created () {
    this.getSearchList()
  },
  methods: {
    // 调用api，获取搜索结果
    async getSearchList () {
      const result = await apiSearchList({ q: this.$route.params.keyword })
      this.searchList = result.results
    },

    // 瀑布流的展示函数
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  display: flex;
  flex-direction: column; // 使得获得的数据向列一样展示
  overflow-y: auto;  // 使得页面有滚动的效果
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
