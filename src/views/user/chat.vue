<template>
  <!-- 小智同学的页面结构 -->
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="talkArea">
      <!-- <div class="chat-item left">
        <van-image fit="cover" round :src="XzImg" />
        <div class="chat-pao">干啥呢，河蟹</div>
      </div>
      <div class="chat-item right">
        <div class="chat-pao">没看正忙，挖沙呢</div>
        <van-image fit="cover" round :src="userInfo.photo" />
      </div>-->

      <!-- 将聊天区域信息的展示，修改如下： -->
      <div
        class="chat-item"
        v-for="(item,k) in talks"
        :key="k"
        :class="item.name==='xz'?'left':'right'"
      >
        <van-image fit="cover" round :src="XzImg" v-if="item.name==='xz'" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image fit="cover" round :src="userInfo.photo" v-if="item.name==='vip'" />
      </div>
    </div>
    <!-- ------------------ -->
    <div class="reply-container van-hairline--top">
      <!-- @keyup.enter:表示 只有按下键盘的 enter键 才可以触发消息的发送
           enter：是修饰符
           输入框 和 提交按钮 都可以发送聊天内容
      -->
      <van-field v-model.trim="content" placeholder="说点什么..." @keyup.enter="send()">
        <van-button size="mini" :loading="isloading" slot="button" @click="send()">提交</van-button>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入安装好的 socket.io-client 模块
import io from 'socket.io-client' // 引入socket.io的客户端代码

// 导入小智的头像
import XzImg from '@/assets/img/XZ.jpg'

// 导入 【获取用户自己信息】的api函数
import { apiUserInfo } from '@/api/user.js'

export default {
  name: 'user-chat',
  data () {
    return {
      content: '', // 即将发表的聊天内容
      isloading: false, // 是否正在提交留言

      XzImg, // 小智的头像，简易成员赋值

      userInfo: {}, // 用户信息,使用{}声明空对象，不要使用null,因为其要在模板在做展示

      socket: null, // 声明socket对象，做连接使用

      talks: [] // 聊天内容的展示区域
      // msg 和 timestamp 是服务器端要求的名字，发送和接收的数据都遵守
      // name是自定义成员，请注意维护
      // msg和timestamp是服务器端要求的名称
      // [
      //  {msg:'用户消息',timestamp:时间,name:'vip'},
      //  {msg:'机器人消息',timestamp:时间,name:'xz'},
      //  {msg:'用户消息',timestamp:时间,name:'vip'},
      //  {msg:'机器人消息',timestamp:时间,name:'xz'},
      // ]
    }
  },
  created () {
    this.getUserInfo()
    this.setSocket() // 调用函数，建立连接
  },
  // beforeDestroy => 生命周期函数  =>  在页面销毁之前触发
  beforeDestroy () {
    // 退出聊天区域时，销毁 socket.io 的连接
    this.socket.close() // socket.close():固定语法，断开socket的连接
    console.log('断开连接')
  },
  methods: {
    // 使得 聊天区域 的滚动条始终在最下边显示-----------------------------------
    scrollBottom () {
      // 通过算法，使得滚动条跑到最下边
      // this.$refs.talkArea.scrollHeight // 表示的是：聊天内容区域的实际高度，包括溢出屏幕的部分

      // 滚动条实际卷起的高度
      // 就是，溢出屏幕的实际高度
      // this.$refs.talkArea.scrollTop

      // 滚动条最底部设置：scrollTop 等于  scrollHeight-窗口高度  [理论]
      // scrollTop 等于  scrollHeight 也可以完成这样效果 [实际操作，简便]

      // scrollHeight  (元素内容区域实际高度，包括滚动条的溢出部分)
      // scrollTop  ( 元素对象实际的最顶端  和  窗口中可见内容的最顶端之间的距离 )

      // this.$nextTick 可以保证：数据变化、视图通过响应式完成了更新，之后再做一些事情
      // 如果不使用这个技术，造成的后果是：增加聊天记录后，滚动条没有滚动到最底部
      // 此时流程是这样的、是错误的：数据变化--->滚动条滚动--->视图更新，(滚动条做了一次无用功)
      // 正确的流程是：数据变化---->视图更新---->滚动条滚动，视图更新后滚动条滚动才会变得有意义
      // 本身是Vue技术

      this.$nextTick(() => {
        this.$refs.talkArea.scrollTop = this.$refs.talkArea.scrollHeight
      })
    },

    // 用户的聊天内容发送的函数---------------------------------------------
    async send () {
      // 若没有聊天内容，则不发送
      if (!this.content) return false

      // 开启 提交按钮 的动画效果
      this.isloading = true

      // 用户的 聊天内容模板 根据后端提供的接口可知
      const userLan = {
        msg: this.content,
        timestamp: Date.now(), // 发言时的 时间戳信息
        name: 'vip'
      }

      // 将用户的聊天消息 添加到 聊天区域里
      this.talks.push(userLan)

      // 内容添加完之后，滚动条滚动到显示最新内容的位置
      this.scrollBottom()

      // 延迟发送的效果
      await this.$sleep(500)

      // 调用 message事件 发送 聊天内容
      // message事件 是 socket.io 的固定语法 不可修改
      this.socket.emit('message', userLan)

      // 消息发送完之后，清空输入框的内容
      this.content = ''

      // 恢复 提交按钮 的动画效果
      this.isloading = false
    },

    // 建立与 服务器端的socket连接-------------------------------------
    setSocket () {
      // 客户端 向 服务器端 发请求，建立连接
      // this.socket = io(服务端地址,参数) // socket.io连接
      this.socket = io('http://ttapi.research.itcast.cn', {
        query: {
          token: this.$store.state.user.token // 根据用户的token信息，来做对应的socket.io连接
        }
      })

      // 连接成功后的，告知提示信息
      // 创建事件，感知连接状态,connect:是固定语法
      this.socket.on('connect', () => {
        console.log('socket.io连接成功')
      })

      // 连接成功后，小智同学 首先开始发言
      // 发言的内容模板如下，根据后端提供的接口可知
      const xzLan = {
        msg: '干啥呢，咋这长时间不联系了？',
        timestamp: Date.now(), // 发言时的 时间戳信息
        name: 'xz'
      }

      // 将小智的发言内容 添加到 聊天内容的展示区域
      this.talks.push(xzLan)

      // 通过调用 message事件 来发送消息
      // message事件 是 socket.io 的固定语法 不可修改
      // 因为后端接口的返回信息里，并没有加上小智的名称， 所以需手动加上 { ...data, name: 'xz' }
      this.socket.on('message', data => {
        // 回来的消息格式为：{msg:机器人回复内容,timestamp:回复时间}
        // console.log(data)
        // 把data存储到talks成员里边
        // this.talks.push({ msg:机器人回复内容,timestamp:回复时间, name: 'xz' })
        this.talks.push({ ...data, name: 'xz' })

        // 内容添加完之后，滚动条滚动到显示最新内容的位置
        this.scrollBottom()
      })

      // 断开连接
      // this.socket.close()
    },

    // ----------------------------------------------------------------
    async getUserInfo () {
      // 获取用户自己的信息，给头像赋值
      this.userInfo = await apiUserInfo()
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 20px;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 140%;
        min-height: 80px;
        line-height: 76px;
        border: 1px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top: 1px solid #c2d9ea;
          border-right: 1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
