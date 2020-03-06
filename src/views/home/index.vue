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
      <van-tab v-for="item in channelList" :key="item.id" :title="item.name">
        <!-- 绑定频道id，以获取对应的文章数据,子组件要通过props接收频道的id参数 -->
        <com-article :channelID="item.id"></com-article>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 导入封装好的展示文章列表的组件
import ComArticle from './components/com-article.vue'

// 导入获取频道数据的api函数
import { apiChannelList } from '@/api/channel.js'

export default {
  name: 'home-index',
  components: {
    ComArticle
  },
  data () {
    return {
      // 设置频道默认激活项目
      activeChannelIndex: 0,

      // 频道数据成员
      channelList: []
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    // 获取频道数据
    async getChannelList () {
      // 通过调用封装好的api获取数据
      const result = await apiChannelList()
      // console.log(result)
      this.channelList = result.channels
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
  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
</style>
