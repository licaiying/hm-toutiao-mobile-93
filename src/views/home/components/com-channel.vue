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
          closed: 组件提供的事件，关闭弹出层且动画结束后触发
                  当弹出层关闭时，我的频道 的状态为 非编辑 状态
    -->
    <van-popup
      :value="value"
      @input="$emit('input',$event)"
      closeable
      round
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '90%' }"
      @closed="isEdit=false"
    >
      <!-- 弹出层页面布局 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <!-- 点击的时候，切换编辑按钮的状态 @click="isEdit=!isEdit" 并做相应的按钮的显示内容-->
            <van-button
              type="danger"
              plain
              size="mini"
              round
              @click="isEdit=!isEdit"
            >{{isEdit?'完成':'编辑'}}</van-button>
          </div>
        </div>
        <!--van-grid 没有设置column-num属性，默认是4列-->
        <van-grid class="channel-content" :gutter="10" clickable>
          <!-- grid-item宫格单元
                  宫格内容表现：
                  1. text属性,设置简单内容
                  2. 匿名插槽，设置复杂内容
          -->
          <van-grid-item
            v-for="(item,k) in channelList"
            :key="item.id"
            :style="{color:k===activeChannelIndex?'red':''}"
          >
            <span class="text">{{item.name}}</span>
            <!-- 叉号按钮图标
                 class="close-icon" 设置样式的
                 v-show="k>0" 使得 推荐 项目不显示叉号按钮
                 当处于编辑状态是，叉号按钮才会显示  isEdit：true 表示是编辑状态
                 userToRest(item {id:xx,name:xx} 用户持久删除, k 项目下标序号 内存删除)
            -->
            <van-icon v-show="k>0 && isEdit" class="close-icon" @click="userToRest(item,k)" name="close" />
          </van-grid-item>
        </van-grid>
      </div>

      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <!-- clickable：是否开启格子点击反馈  true：表示开启 -->
        <van-grid class="channel-content" :gutter="10" clickable>
          <!-- 给推荐频道绑定事件@click="restToUser(item)"  以便实现添加操作 -->
          <van-grid-item v-for="item in restChannels" :key="item.id" @click="restToUser(item)">
            <div class="info">
              <span class="text">{{item.name}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script type="text/javascript">
// 导入获取“全部频道”  "添加频道" "删除频道" 的api函数
import { apiChannelAll, apiChannelAdd, apiChannelDel } from '@/api/channel.js'

export default {
  name: 'com-channel',
  // 接收父组件（v-model）传递过来的值
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 接收父组件传递的“我的频道”列表数据
    channelList: {
      type: Array,
      // 数组的默认值要通过函数functon方式设置,箭头函数也可以
      // default:()=>{
      //     return []
      // }
      // 以上代码可简写为如下
      default: () => []
    },
    // 接收父组件传递的当前激活频道的下标
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 全部频道数据
      channelAll: [],

      // 控制 我的频道 的编辑状态
      isEdit: false // 默认不是编辑状态
    }
  },

  // 计算属性有缓存，相关data不变化，"结果"会缓存，提升系统性能
  computed: {
    // 获得剩余频道( 全部频道-我的频道 )
    restChannels () {
      // 1. 把 我的频道  的 各个id获得出来，集成一个数组返回 [10,15,23,44……]
      // map是映射方法，遍历数组，并以"数组"形式返回修饰后的每个单元信息信息
      // 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide
      const userChannelIDs = this.channelList.map(item => {
        return item.id
      })

      // 2. 对 全部频道 做过滤，把“不符合” 我的频道 的项目收集并返回出来，就是【剩余频道】
      //    数组.filter()  过滤方法，把符合条件的数组元素通过“新数组”给与返回
      //    (全部频道 去除 我的频道 给与返回)
      const rest = this.channelAll.filter(item => {
        // 我的频道  里边不包含当前项目，就给与收集
        // 判断我的频道id集合 是否包含当前项目，不包含的才收集
        // 数组.includes(元素)  判断数组中是否有出现某个元素，返回Boolean
        return !userChannelIDs.includes(item.id)
      })

      // 将“剩余频道”的数据返回出去
      return rest
    }
  },
  created () {
    this.getChannelAll()
  },
  methods: {
    // 1.获取频道的全部数据
    async getChannelAll () {
      const result = await apiChannelAll()
      // 全部的频道数据
      this.channelAll = result.channels
    },

    // 2.频道做添加的操作函数
    restToUser (channel) {
      // A.将被点击的 频道 添加到 我的频道 里
      // 父组件的页面也要实现添加频道的功能
      // 但是因为现在的父子组件使用了v-model的原因，子组件的数据channelList就是父组件传递过来的
      // 所以，当子组件做了添加操作时，父组件也会做相应的添加操作
      this.channelList.push(channel)

      // B.调用添加的api，实现本地localStorage的持久添加
      apiChannelAdd(channel)
    },

    // 3.频道做删除的操作函数
    userToRest (channel, index) {
      // 1. 对channelList做页面内存级删除，使得有响应式效果
      //  A. 我的频道立即呈现删除效果，
      //  B. 剩余频道会增加删除的项目，
      //  C. 父页面home/index.vue也会体现删除效果
      //  D.因为现在的父子组件使用了v-model的原因
      this.channelList.splice(index, 1)

      // B.localStorage中的持久删除
      apiChannelDel(channel)
    }
  }
}
</script>

<style scoped lang="less" >
.channel {
  margin-top: 70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color: gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
