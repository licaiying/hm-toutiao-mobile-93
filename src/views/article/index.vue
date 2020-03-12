<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <!-- 文章详情的列表展示区域 -->
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | formatTime}}</p>
        </div>
        <van-button
          round
          size="small"
          :type="article.is_followed?'default':'info'"
          @click="followMe()"
          :loading="isFollowed"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:article.attitude===1}"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button
          round
          size="small"
          plain
          icon="delete"
          :class="{active:article.attitude===0}"
        >不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
// 导入获取文章详情的api函数
import { apiArticleDetail } from '@/api/article.js'

// 导入 关注 和 取消关注 的api函数
import { apiFollow, apiUnFollow } from '@/api/user.js'

export default {
  // 每个组件name声明的名字【不要】与html标签重名，
  // 例如div、span、table，article、header、footer
  name: 'com-article',
  data () {
    return {
      // 文章详情的数据对象信息
      article: {},

      isFollowed: false // 关注按钮的加载效果
    }
  },
  created () {
    this.getArticleDetail()
  },
  methods: {
    // 2.关注/取消关注的函数
    async followMe () {
      // 开启按钮的‘加载中’效果
      this.isFollowed = true

      // 延迟效果
      await this.$sleep(1000)

      // 当前是‘关注’
      if (this.article.is_followed) {
        // 取消关注
        await apiUnFollow(this.article.aut_id.toString())
        // 页面更新数据，使得响应式执行
        this.article.is_followed = false
      } else {
        // 关注(不是都成功，自己关注自己要失败，要做相关处理)
        // 当前是‘取消关注’
        try {
          await apiFollow(this.article.aut_id.toString())
          this.article.is_followed = true
        } catch (err) {
          if (err.response.status === 400) {
            this.$toast.fail('自己不能关注自己')
          } else {
            this.$toast.fail('关注失败')
          }
        }
      }

      // 结束加载动画
      this.isFollowed = false
    },

    // 1.获取文章的详细数据信息
    async getArticleDetail () {
      const result = await apiArticleDetail(this.$route.params.aid)
      this.article = result
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  margin-top: 92px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p {
      font-size: 28px;
    }
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
