<template>
  <div>
    <!-- :showConfirmButton="false"：不显示确认按钮
            closeOnClickOverlay：是否在点击遮罩层后关闭弹窗 默认true：不关闭  false：关闭
            :value="value"：接收父组件传递过来的布尔值，以控制弹框的显示和隐藏
             @input="$emit('input',$event)"：感知当前value的变化，将变化后的值传递给父组件的v-model里，以控制父组件中弹出框的显示和隐藏
             组件标签使用：@input="$emit('input',$event)" ---是vant组件库封装好的，就直接使用$event
             普通表单域使用：$emit('input',$event.target.value)
             closed 关闭弹窗时触发，是Dialog组件提供的方法,isOneLevel=true，使得一级弹框被激活显示
    -->
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      :showConfirmButton="false"
      closeOnClickOverlay
      @closed="isOneLevel=true"
    >
      <!-- 一级弹框 -->
      <van-cell-group v-if="isOneLevel">
        <van-cell title="不感兴趣" icon="location-o" @click="articleDislike()" />
        <van-cell title="反馈垃圾内容" icon="location-o" is-link @click="isOneLevel=false" />
        <van-cell title="拉黑作者" icon="location-o" />
      </van-cell-group>

      <!-- 二级弹框 -->
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isOneLevel=true" />
        <van-cell title="其他问题" icon="location-o" />
        <van-cell title="标题夸张" icon="location-o" />
        <van-cell title="低俗色情" icon="location-o" />
        <van-cell title="错别字多" icon="location-o" />
        <van-cell title="旧闻重复" icon="location-o" />
        <van-cell title="广告软文" icon="location-o" />
        <van-cell title="内容不实" icon="location-o" />
        <van-cell title="涉嫌违法犯罪" icon="location-o" />
        <van-cell title="侵权" icon="location-o" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
// 调用处理“不感兴趣”文章的api函数
import { apiArticleDislike } from '@/api/article.js'

export default {
  name: 'more-action',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleID: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      isOneLevel: true // 控制一级、二级弹框的显示，默认先显示“一级弹框”
    }
  },
  methods: {
    // 对不感兴趣文章的处理函数
    async articleDislike () {
      // 调用api
      await apiArticleDislike(this.articleID)
      //   console.log(result)
      this.$toast.success('处理成功') // 成功的提示信息
      this.$emit('input', false) // 关闭弹出框,修改父组件的showDialog的值为false，进而影响子组件关闭弹框
      this.$emit('dislikeSuccess') // 调用子组件自己的事件，实现对不感兴趣文章的删除
    }
  }
}
</script>

<style scoped lang="less" >
</style>
