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
      <van-tab title="推荐">推荐内容</van-tab>
      <van-tab title="数据库">数据库内容</van-tab>
      <van-tab title="后端">后端内容</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home-index',
  data () {
    return {
      // 设置频道默认激活项目
      activeChannelIndex: 0
    }
  }
}
</script>

<style scoped lang='less'></style>
