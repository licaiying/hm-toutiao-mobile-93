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

      <!--van-field 输入框表单域组件
        label="手机号" 表单域前边的名字设置
        required：不进行校验，设置表单域前边有"红星"
        clearable：表单域内容可以通过右侧“叉号”清除
      -->
      <!-- ValidationProvider配置属性，以完成校验
        rules：配置校验规则
        name="手机号"  设定项目名称，校验失败的时候好给与提示
        v-slot：作用域插槽，用于接收校验的错误信息
        v-slot="stData"
        表单校验失败接收错误信息： {{stData.errors[0]}}

        v-slot="{errors}" 对象解构赋值
        表单校验失败接收错误信息： {{errors[0]}}

        v-slot应用场合：template标签、组件标签
        slot-scope应用场合：template标签、组件标签、普通html标签

        ValidationProvider接收插槽数据必须使用v-slot，不能用slot-scope
        该组件内部规则决定的

        形式：slot-scope="stData"
        （v-slot与 slot-scope作用相似，用于接收插槽数据）
      -->
      <!-- 注意: required|phone ,|竖线 左右不要设置空格 -->
      <ValidationObserver ref="loginFormRef">
        <ValidationProvider rules="required|phone" name="手机号" v-slot="{ errors }">
          <!-- :error-message:给输入框设置表达校验错误信息 -->
          <van-field
            v-model="loginForm.mobile"
            type="tel"
            placeholder="请输入手机号码"
            label="手机号"
            required
            clearable
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider rules="required" name="验证码" v-slot="{ errors }">
          <van-field
            v-model="loginForm.code"
            type="password"
            placeholder="请输入验证码"
            label="验证码"
            required
            clearable
            :error-message="errors[0]"
          >
            <!-- "命名插槽"应用，提示相关按钮，是要给van-field组件内部的slot去填充的
        size="small" 设置按钮大小的
        type="primary" 设置按钮背景颜色
            -->
            <van-button slot="button" size="small" type="primary">发送验证码</van-button>
          </van-field>
        </ValidationProvider>
      </ValidationObserver>
    </van-cell-group>
    <div class="login-btn">
      <!--van-button
        type:按钮背景颜色,info是蓝色
        size:按钮大小的
        round：圆边效果
        block：块级样式设置，占据一行
      -->
      <van-button
        type="info"
        size="small"
        round
        block
        @click="login()"
        :loading="isLogin"
        loading-text="登录中"
      >登录</van-button>
    </div>
  </div>
</template>

<script>
// 导入登录请求的api
import { apiUserLogin } from '@/api/user.js'

// 导入表单验证的相关模块
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: 'user-login',
  components: {
    // 注册验证模块
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      // “登录”按钮，是否处于“登录中”的状态  false：不是“登录中”的状态
      isLogin: false,

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
      // 对全部表单进行校验
      // validate()方法调用完毕后会返回一个Promise对象，所以可用await进行修饰
      const valid = await this.$refs.loginFormRef.validate()
      // console.log(valid) // false 校验失败   true 校验成功
      if (!valid) {
        // 校验失败，停止后续代码的执行
        return false
      }

      // 当全部的表单项都校验完毕后，“登录”按钮可显示“登录中”的状态
      this.isLogin = true

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
        // 登录失败时，登录按钮也不显示“登录中”的状态
        this.isLogin = false

        // 账号错误，$toast.fail()是vant组件库提供的"错误提示"应用语法
        // 与element-ui提供的 $message.error()是对应的
        // return 表示停止后续代码执行
        return this.$toast.fail('手机号或验证码错误' + err)
      }

      // 成功登录后，恢复按钮的状态
      this.isLogin = false

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
