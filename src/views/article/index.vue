<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <!-- 文章详情的列表展示区域 -->
    <div class="detail">
      <h3 class="title">美女与野兽</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="text">
          <p class="name">一阵清风</p>
          <p class="time">两周内</p>
        </div>
        <van-button round size="small" type="info">+ 关注</van-button>
      </div>
      <div class="content">
        <p>文章内容文章内容文章内容</p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          class="active"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button round size="small" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 每个组件name声明的名字【不要】与html标签重名，
  // 例如div、span、table，article、header、footer
  name: 'com-article'
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
