<template>
  <div class="page-user-profile">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <!-- center:是否使内容垂直居中 -->
      <!--
            单元格可以通过命名插槽对各个位置进行填充
            具体要表现头像 slot="default" 定义value右侧单元格内容
      -->
      <!--
            round 使得图片变为圆形
            fit="cover" 对图片做适应 保持宽高缩放图片，使图片的“短边”能完全显示出来，裁剪“长边”
      -->
      <van-cell title="头像" is-link center>
        <van-image
          slot="default"
          round
          width="56"
          height="56"
          fit="cover"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        ></van-image>
      </van-cell>
      <van-cell title="名称" is-link value="用户名称"></van-cell>
      <van-cell title="性别" is-link value="男"></van-cell>
      <van-cell title="生日" is-link value="2019-08-08"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'user-profile'
}
</script>

<style scoped lang='less'></style>
