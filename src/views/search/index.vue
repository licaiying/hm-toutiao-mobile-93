<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- 搜索框区域 -->
    <!-- v-model: 双向数据绑定，感知/设置 输入框的相关内容 -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词" />
    <van-cell-group>
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'search-index',
  data () {
    return {
      searchText: '' // 用户输入的搜索关键字
    }
  }
}
</script>

<style scoped lang='less'></style>
