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
            <span
              @click="openReply(item.com_id.toString())"
            >{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>

    <!-- 回复列表展示-弹出层/瀑布 -->
    <van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }" round>
      <!-- 瀑布加载效果 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="onLoadReply"
      >
        <van-cell v-for="item in replyList" :key="item.com_id.toString()">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" :src="item.aut_photo" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>{{item.aut_name}}</span>
          </div>
          <!-- 回复内容和时间 -->
          <div slot="label">
            <p>{{item.content}}</p>
            <p>
              <span>{{item.pubdate | formatTime}}</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>

    <!-- 添加评论或回复的小构件 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="contentCorR" placeholder="写评论或回复...">
        <!-- slot="button"命名插槽，表明要给van-field的指定位置填充内容，button是输入框的右侧-->
        <van-button size="mini" :loading="submitting" slot="button">提交</van-button>
      </van-field>
    </div>
  </div>
</template>

<script type="text/javascript">
// 导入获取回复数据的api
import { apiReplyList } from '@/api/reply.js'

// 导入获取文章评论的api函数
import { apiCommentList } from '@/api/comment.js'

export default {
  name: 'com-comment',
  data () {
    return {
      // 评论瀑布相关成员-------------------------------------------
      list: [], // demo数据
      loading: false, // 瀑布动画控制
      finished: false, // 瀑布停止控制
      commentList: [], // 评论列表数据
      offset: null, // 评论的分页偏移量数据

      // 回复瀑布相关成员--------------------------------------------
      // 通过reply成员包围，使得与外部的评论瀑布成员没有冲突
      showReply: false, // 回复弹出层是否展示
      replyList: [], // 回复列表数据
      commentID: '', // 被点击时，激活的评论的id
      lastID: null, // 回复的分页标志(null、前一次返回的last_id)
      reply: {
        list: [],
        loading: false, // 瀑布动画
        finished: false // 瀑布停止标志
      },

      // 添加评论或回复成员------------------------------------------------
      contentCorR: '', // 内容
      submitting: false // 是否正在提交
    }
  },
  methods: {
    // 单击回复标志，展示回复弹出层逻辑--------------------------------------
    // 参数comID：传递过来的，被激活的评论id，需接收
    openReply (comID) {
      this.commentID = comID // 评论的id
      this.showReply = true // 点击时，打开弹出层

      // 每次打开回复弹出层都要做初始化操作，把之前旧的"痕迹"都清除，使得新的回复信息得以展示
      this.replyList = [] // 旧的回复数据清除
      this.lastID = null // 恢复分页偏移量
      this.reply.finished = false // 激活瀑布
    },

    // 回复瀑布加载---------------------------------------
    async onLoadReply () {
      // 延迟效果(0.8秒)
      await this.$sleep(800)

      // 获取回复的列表数据信息
      const result = await apiReplyList({
        commentID: this.commentID, // 评论的id
        lastID: this.lastID
      })

      // 获取到数据后，停止动画效果
      this.reply.loading = false

      // 若没有获取到数据
      if (result.results.length === 0) {
        this.reply.finished = true // 停止瀑布动画
        return false // 停止后续代码的执行
      }

      // 获取到数据
      // 将获取到的数据追加到data成员中的replyList数组中
      this.replyList.push(...result.results)
      this.lastID = result.last_id // 分页偏移量的更新

      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.reply.list.push(this.reply.list.length + 1)
      //     }

      //     // 加载状态结束
      //     this.reply.loading = false

      //     // 数据全部加载完成
      //     if (this.reply.list.length >= 40) {
      //       this.reply.finished = true
      //     }
      //   }, 1000)
    },

    // 评论瀑布加载---------------------------------------
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

// 添加评论或回复构件
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
