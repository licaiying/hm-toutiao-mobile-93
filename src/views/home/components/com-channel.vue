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
    />
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
</style>
