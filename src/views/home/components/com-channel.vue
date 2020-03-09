<template>
  <div>
    <!-- 弹出层 -->
    <!-- 暂时体现弹出层效果
          v-model="show"  控制弹出层是否显示true/false，
                          单击遮罩层，弹出层关闭，这show自动为false
          position="bottom"  弹出层从底部出来
          :style="{ height: '40%' }" 弹出层高度
          closeable  有关闭按钮
          close-icon-position="top-left"  按钮在左上角显示
          round 有圆角
    -->
    <van-popup
      :value="value"
      @input="$emit('input',$event)"
      closeable
      round
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 弹出层页面布局 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button type="danger" plain size="mini" round>编辑</van-button>
          </div>
        </div>
        <!--van-grid 没有设置column-num属性，默认是4列-->
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item v-for="value in 8" :key="value">
            <span class="text">文字</span>
            <!-- <van-icon class="close-icon" name="close" /> -->
          </van-grid-item>
        </van-grid>
      </div>

      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item v-for="value in 8" :key="value">
            <div class="info">
              <span class="text">文字</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'com-channel',
  // 接收父组件（v-model）传递过来的值
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less" >
.channel {
  margin-top:70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color:gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
