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
        <van-cell title="拉黑作者" icon="location-o" @click="lahei()" />
      </van-cell-group>

      <!-- 二级弹框 -->
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isOneLevel=true" />
        <van-cell
          v-for="item in reportList"
          :title="item.title"
          :key="item.value"
          icon="location-o"
          @click="articleReport(item.value)"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
// 调用处理“不感兴趣”文章的api函数
// 导入‘举报文章’的api函数
import { apiArticleDislike, apiArticleReport } from '@/api/article.js'

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
      isOneLevel: true, // 控制一级、二级弹框的显示，默认先显示“一级弹框”

      // 举报文章的类型
      reportList: [
        { title: '其他问题', value: 0 },
        { title: '标题夸张', value: 1 },
        { title: '低俗色情', value: 2 },
        { title: '错别字多', value: 3 },
        { title: '旧闻重复', value: 4 },
        { title: '广告软文', value: 5 },
        { title: '内容不实', value: 6 },
        { title: '涉嫌违法犯罪', value: 7 },
        { title: '侵权', value: 8 }
      ]
    }
  },
  methods: {
    // 1.对不感兴趣文章的处理函数
    async articleDislike () {
      // 调用api
      await apiArticleDislike(this.articleID)
      //   console.log(result)
      this.$toast.success('处理成功') // 成功的提示信息
      this.$emit('input', false) // 关闭弹出框,修改父组件的showDialog的值为false，进而影响子组件关闭弹框
      this.$emit('dislikeSuccess') // 调用子组件自己的事件，实现对不感兴趣文章的删除
    },

    // 2."拉黑作者"的处理函数
    async lahei () {
      // 调用api(与“不感兴趣”的api是同一个)
      await apiArticleDislike(this.articleID) // 发请求
      this.$toast.success('拉黑作者成功') // 成功的提示信息
      this.$emit('input', false) // 关闭弹出框,修改父组件的showDialog的值为false，进而影响子组件关闭弹框
      this.$emit('dislikeSuccess') // 调用子组件自己的事件，实现对拉黑作者的文章的删除操作
    },

    // 3.举报文章的处理函数
    async articleReport (type) {
      // 因为举报文章有可能失败，会返回409的状态码，表示文章已经举报过了
      // 所以，需要使用try、catch 捕获错误信息
      // obj：发请求时，需要传递的参数信息对象，根据api接口获知
      // try/catch 可以对服务器返回的异常信息进行捕捉，如果不设置，会造成程序中断执行
      try {
        const obj = { articleID: this.articleID, type }
        await apiArticleReport(obj)
      } catch (err) {
        if (err.response.status === 409) {
          // return:停止后续代码的执行
          return this.$toast.fail('文章已经被举报过了')
        }
      }
      // 成功的提示信息
      this.$toast.success('文章举报成功')
      // 关闭弹框
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped lang="less" >
</style>
