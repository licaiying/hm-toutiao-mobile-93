<template>
  <div>
    <!-- :showConfirmButton="false"：不显示确认按钮
            closeOnClickOverlay：是否在点击遮罩层后关闭弹窗 默认true：不关闭  false：关闭
            :value="value"：接收父组件传递过来的布尔值，以控制弹框的显示和隐藏
             @input="$emit('input',$event)"：感知当前value的变化，将变化后的值传递给父组件的v-model里，以控制父组件中弹出框的显示和隐藏
             组件标签使用：@input="$emit('input',$event)" ---是vant组件库封装好的，就直接使用$event
             普通表单域使用：$emit('input',$event.target.value)
    -->
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      :showConfirmButton="false"
      closeOnClickOverlay
    >vvvvvvvvvvvv</van-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'more-action',
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
