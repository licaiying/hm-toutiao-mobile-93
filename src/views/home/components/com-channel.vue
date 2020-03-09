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
    -->
    <van-popup
      :value="value"
      @input="$emit('input',$event)"
      closeable
      round
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 弹出层页面布局 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button type="danger" plain size="mini" round>编辑</van-button>
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
            <!-- <van-icon class="close-icon" name="close" /> -->
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
          <van-grid-item v-for="item in restChannels" :key="item.id">
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
// 导入获取“全部频道”数据的api函数
import { apiChannelAll } from '@/api/channel.js'

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
      channelAll: []
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
