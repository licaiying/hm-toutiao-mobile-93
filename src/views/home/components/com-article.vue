<template>
  <!-- div的作用是给瀑布流区域设置“垂直滚动条”，使得可以进行上拉操作 -->
  <div class="scroll-wrapper">
    <!-- v-model="loading" 数据加载时的效果
               :finished="finished"  数据是否加载完毕，若加载完毕finished 为true
                finished-text="没有更多了"  数据加载完毕后的提示信息
                @load="onLoad"  数据加载时执行的事件函数(滚动条与底部距离小于指定的值时触发)
    -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- van-cell：单元格组件，独占一行，显示每一条数据 -->
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'com-article',
  data () {
    return {
      // 瀑布流相关成员
      list: [], // 数据展示的数据源
      loading: false, // 是否处于加载状态，默认先“不加载”
      finished: false // 数据是否加载完毕，瀑布流是否停止
    }
  },
  methods: {
    // 瀑布流上拉执行的函数
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
          this.finished = true // 数据已全部加载完毕，将finished改为true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less" >
// 给上拉列表区域设置样式
.scroll-wrapper {
  height: 100%;
  // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
  // 是瀑布实现的关键要素
  overflow-y: auto;
}
</style>
