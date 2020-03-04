<template>
  <div class="user-login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"></van-nav-bar>
    <!-- 表单部分
      van-cell-group是对普通表单域组件做封装
    -->
    <van-cell-group>
      <!--van-field 输入框表单域组件
        label="手机号" 表单域前边的名字设置
        required：不进行校验，设置表单域前边有"红星"
        clearable：表单域内容可以通过右侧“叉号”清除
      -->
      <van-field
        v-model="loginForm.mobile"
        type="tel"
        placeholder="请输入手机号码"
        label="手机号"
        required
        clearable
      />
      <van-field
        v-model="loginForm.code"
        type="password"
        placeholder="请输入验证码"
        label="验证码"
        required
        clearable
      >
        <!-- "命名插槽"应用，提示相关按钮，是要给van-field组件内部的slot去填充的
        size="small" 设置按钮大小的
        type="primary" 设置按钮背景颜色
        -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <!--van-button
        type:按钮背景颜色,info是蓝色
        size:按钮大小的
        round：圆边效果
        block：块级样式设置，占据一行
      -->
      <van-button type="info" size="small" round block @click="login()">登录</van-button>
    </div>
  </div>
</template>

<script>
// 导入登录请求的api
import { apiUserLogin } from '@/api/user.js'

export default {
  name: 'user-login',
  data () {
    return {
      // 登录表单数据对象
      // mobile和code是"api数据接口"告诉的，不是自定义的
      loginForm: {
        mobile: '13911111111', // 手机号码
        code: '246810' // 验证码
      }
    }
  },
  methods: {
    async login () {
      // apiUserLogin函数执行有可能成功、也有可能失败，请try、catch判断使用
      try {
        // 校验账号有效性
        // 所有api函数返回结果就是axios返回结果，就是Promise对象
        const result = await apiUserLogin(this.loginForm)
        // api函数执行成功代表账号正确
        // 如果报400的错误信息，代表账号错误，并且是致命错误，会阻止后续程序代码运行
        // 因此，判断账号是否正确，不用通过result返回值，需要try/catch介入
        // console.log(result)  // {token:xxx, refresh_token:xxx}

        // 通过vuex维护服务器端返回的token等秘钥信息
        this.$store.commit('updateUser', result)
      } catch (err) {
        // 账号错误，$toast.fail()是vant组件库提供的"错误提示"应用语法
        // 与element-ui提供的 $message.error()是对应的
        // return 表示停止后续代码执行
        return this.$toast.fail('手机号或验证码错误' + err)
      }

      // 登录成功的提示信息
      this.$toast.success('登录成功')
      // 跳转到首页
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped lang='less'>
// 登录按钮样式
.login-btn {
  margin: 40px;
}
</style>
