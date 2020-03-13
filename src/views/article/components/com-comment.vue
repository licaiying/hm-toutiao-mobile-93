<template>
  <div class="comment">
    <!--van-list：实现瀑布加载效果-->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in commentList" :key="item.com_id.toString()">
        <!-- 作者头像
          slot="icon" 是cell单元格命名插槽，自定义左侧图标
        -->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <!-- 作者名称
          slot="title" 是cell单元格命名插槽，左侧标题内容
        -->
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <!-- 点赞
          slot="default" 是cell单元格命名插槽，右侧内容
        -->
        <div slot="default">
          <van-button
            icon="like-o"
            :type="item.is_liking?'danger':'default'"
            size="mini"
            plain
          >&nbsp;{{item.like_count}}</van-button>
        </div>
        <!-- 评论内容和时间
          slot="label" 是cell单元格命名插槽，下方描述信息
        -->
        <div slot="label">
          <p v-html="item.content"></p>
          <p>
            <span>{{item.pubdate | formatTime}}</span>
            ·
            <span>{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script type="text/javascript">
// 导入获取文章评论的api函数
import { apiCommentList } from '@/api/comment.js'

export default {
  name: 'com-comment',
  data () {
    return {
      // 评论瀑布相关成员-------------------------------------
      list: [], // demo数据
      loading: false, // 瀑布动画控制
      finished: false, // 瀑布停止控制
      commentList: [], // 评论列表
      offset: null // 分页偏移量数据
    }
  },
  methods: {
    async onLoad () {
      // 延迟效果(0.8秒)
      await this.$sleep(800)

      // 根据文章的id获取评论的数据做展示
      const result = await apiCommentList({
        articleID: this.$route.params.aid,
        offset: this.offset
      })

      // 加载动画结束
      this.loading = false

      // 对获得到的数据做判断
      // 以下，说明已没有数据可加载，结束动画
      if (result.results.length === 0) {
        this.finished = true
        return false // 停止后续代码执行
      }

      // 获取到了数据
      // 将获得到的数据追加到data中的commentList数组中
      this.commentList.push(...result.results)
      this.offset = result.last_id // 分页偏移量的更新

      // 异步更新数据
      //   setTimeout(() => {
      //     for (let i = 0; i < 5; i++) {
      //       this.list.push(this.list.length + 1)
      //     }
      //     // 加载状态结束
      //     this.loading = false

      //     // 数据全部加载完成
      //     if (this.list.length >= 10) {
      //       this.finished = true
      //     }
      //   }, 500)
    }
  }
}
</script>

<style scoped lang="less" >
.comment {
  margin-top: 15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }
  /deep/ .van-cell__title {
    .van-cell__label {
      width: 400px;
    }
  }
}
</style>
