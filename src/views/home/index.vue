<template>
  <div class="container">
    <!--
      van-tabs:标签页组件
        v-model设置默认激活项目 ，激活根据是项目的下标，从0开始
      van-tab: 标签页项目组件
        title：标签名称
        内容区域：标签对应内容
    -->
    <van-tabs v-model="activeChannelIndex">
      <van-tab title="推荐">
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
      </van-tab>
      <van-tab title="数据库">数据库内容</van-tab>
      <van-tab title="后端">后端内容</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home-index',
  data () {
    return {
      // 设置频道默认激活项目
      activeChannelIndex: 0,

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

<style scoped lang='less'>
.van-tabs {
  // 弹性布局
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  // 标签页全部内容展示区域
  /deep/ .van-tabs__content {
    // flex:1;的值是1 1 0%，【父控件有剩余空间占1份放大，父控件空间不足按1缩小，自身的空间大小是0%】
    flex: 1;
    overflow: hidden;
  }
  // 标签页具体内容展示区域
  /deep/ .van-tab__pane {
    height: 100%;
    // 给上拉列表区域设置样式
    .scroll-wrapper {
      height: 100%;
      // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
      // 是瀑布实现的关键要素
      overflow-y: auto;
    }
  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
</style>
