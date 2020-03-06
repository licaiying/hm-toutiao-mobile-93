<template>
  <!-- div的作用是给瀑布流区域设置“垂直滚动条”，使得可以进行上拉操作 -->
  <div class="scroll-wrapper">
    <!-- 下拉功能 -->
    <!-- v-model="isLoading"：是设置下拉状态的  true：正在加载  false：加载完成
         @refresh="onRefresh"：当发生下拉事件时执行的函数，可以实现数据的获取
    -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 上拉功能 -->
      <!-- v-model="loading" 数据加载时的效果
               :finished="finished"  数据是否加载完毕，若加载完毕finished 为true
                finished-text="没有更多了"  数据加载完毕后的提示信息
                @load="onLoad"  数据加载时执行的事件函数(滚动条与底部距离小于指定的值时触发)
      -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- van-cell：单元格组件，独占一行，显示每一条数据 -->
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'com-article',
  // 1.简单方式--接收父组件传递参数
  // props:['channelID'],
  // 2.高级方式--接收父组件传递参数
  props: {
    channelID: {
      type: Number, // 接收的参数类型，若参数类型不对，则接收不到数据  类型有：Number、String、Array
      required: true // 是否必须接收,true表示必须接收
    }
  },
  data () {
    return {
      // 上拉--瀑布流相关成员
      list: [], // 数据展示的数据源
      loading: false, // 是否处于加载状态，默认先“不加载”
      finished: false, // 数据是否加载完毕，瀑布流是否停止

      // 下拉--相关成员
      isLoading: false // 加载状态，默认不加载
    }
  },
  methods: {
    // 上拉--瀑布流执行的函数
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
    },

    // 下拉--执行的函数
    onRefresh () {
      setTimeout(() => {
        this.onLoad() // 调用上拉函数，获得数据
        this.$toast.success('刷新成功') // 下拉加载成功的提示信息
        this.isLoading = false // 下拉加载完成后，结束加载动画
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
