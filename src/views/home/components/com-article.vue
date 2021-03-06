<template>
  <!-- div的作用是给瀑布流区域设置“垂直滚动条”，使得可以进行上拉操作 -->
  <!-- @scroll:滚动事件 -->
  <div class="scroll-wrapper" @scroll="remember()" ref="myArticle">
    <!-- 下拉功能 -->
    <!-- v-model="isLoading"：是设置下拉状态的  true：正在加载  false：加载完成
         @refresh="onRefresh"：当发生下拉事件时执行的函数，可以实现数据的获取

         :success-text="successText" 下拉动作完成后的信息提示[已经是最新的了/文章更新成功]
         success-duration="1500 下拉动作完成后的信息提示 停留时间
    -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="successText"
      success-duration="1500"
    >
      <!-- 上拉功能 -->
      <!-- v-model="loading" 数据加载时的效果
               :finished="finished"  数据是否加载完毕，若加载完毕finished 为true
                finished-text="没有更多了"  数据加载完毕后的提示信息
                @load="onLoad"  数据加载时执行的事件函数(滚动条与底部距离小于指定的值时触发)
      -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- van-cell：单元格组件，独占一行，显示每一条数据 -->
        <!-- art_id:是超大整形数据，是数字类型，需要转换为字符串 -->
        <van-cell
          v-for="item in articleList"
          :key="item.art_id.toString()"
          :title="item.title"
          @click="$router.push({name:'article',params:{aid:item.art_id.toString()}})"
        >
          <!-- 通过命名插槽方式体现单元格下方描述信息 -->
          <template slot="label">
            <!-- 宫格组价 -->
            <!-- 封面图片类型：没有type=0、 1个type=1、 3个type=3 -->
            <!-- 新闻封面图片也是通过label描述位置体现
                 :column-num 根据type的值决定显示的列数
                 v-if="item.cover.type>0" 要求type>0才体现宫格
                 :border="false" 宫格没有边框
            -->
            <van-grid :border="false" v-if="item.cover.type>0" :column-num="item.cover.type">
              <van-grid-item v-for="(item2,k2) in item.cover.images" :key="k2">
                <!-- 图片信息 -->
                <!-- lazy-load:是图片组件(van-image)提供的属性 -->
                <van-image width="90" height="90" :src="item2" lazy-load />
              </van-grid-item>
            </van-grid>
            <!-- 文字描述信息 -->
            <!--  van-icon:图标组件   name="close"代表叉号 -->
            <!-- 加.stop的原因：
                外部已经有click事件了，内部还有click事件
                内部的click执行的时候，外部也会执行，导致内部失效，这是事件冒泡体现
                处理：阻止事件冒泡
            .stop是vue内部的修饰符，可以阻止事件冒泡-->
            <p>
              <van-icon
                name="close"
                style="float:right"
                @click.stop="displayDialog(item.art_id.toString())"
              />
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate | formatTime}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 使用弹出框组件 -->
    <!-- v-model:是否显示弹框，是Dialog组件提供的属性 值为布尔值  true：显示  false：不显示 -->
    <more-action
      v-model="showDialog"
      :articleID="nowArticleID"
      @dislikeSuccess="handleDislikeSuccess"
    ></more-action>
  </div>
</template>

<script type="text/javascript">
// 导入封装好的获取文章数据的api函数
import { apiArticleList } from '@/api/article.js'

// 导入“弹出框”子组件
import MoreAction from './com-moreaction.vue'

export default {
  name: 'com-article',
  // 1.简单方式--接收父组件传递参数
  // props:['channelID'],
  // 2.高级方式--接收父组件传递参数
  components: {
    MoreAction
  },
  props: {
    channelID: {
      type: Number, // 接收的参数类型，若参数类型不对，则接收不到数据  类型有：Number、String、Array
      required: true // 是否必须接收,true表示必须接收
    }
  },
  data () {
    return {
      // 记录滚动条，滚动的高度位置
      qianTop: 0,

      // 下拉更新完成的提示信息
      successText: '',

      // 对应弹出框的文章的id
      nowArticleID: '', // 不感兴趣的文章的id

      // 是否显示“弹出框”
      showDialog: false, // 默认先‘不显示’

      // 文章列表数据
      articleList: [],

      // 时间戳参数，通过ts声明时间戳条件，这样后期可以灵活发生变化
      ts: Date.now(), // 时间戳是文章列表分页的条件

      // 上拉--瀑布流相关成员
      list: [], // 数据展示的数据源
      loading: false, // 是否处于加载状态，默认先“不加载”
      finished: false, // 数据是否加载完毕，瀑布流是否停止

      // 下拉--相关成员
      isLoading: false // 加载状态，默认不加载
    }
  },
  created () {
    this.getArticleList()
  },

  // activated： 是keep-alive 组件激活时，自动调用的生命周期钩子方法
  // activated是生命周期方法，要设置到与created并列的位置
  activated () {
    // 当再次返回时(即：再次激活时)，如果记录了滚动条的滚动高度，那么就让文章的卷起高度=该记录的高度
    if (this.qianTop) {
      this.$refs.myArticle.scrollTop = this.qianTop
    }
  },
  methods: {
    // 记录滚动条，滚动的位置--------------------------------------------
    remember () {
      // 保留滚动条，滚动的位置
      // 滚动条滚动的高度位置=文章的卷起高度
      this.qianTop = this.$refs.myArticle.scrollTop
    },

    // 对“不感兴趣”文章的处理函数
    handleDislikeSuccess () {
      // 根据文章的id找到其在文章列表中对应的索引值，实现对该文章的删除操作
      // findIndex()是数组的一个方法，可以通过条件获得指定目标在数组列表中的"下标序号"，有遍历机制
      const index = this.articleList.findIndex(item => {
        // 满足条件就return为true信息出来，那么当前项目的下标序号就获得的到了
        return item.art_id.toString() === this.nowArticleID
      })
      // 根据索引值，从文章列表中删除文章(只是页面级删除)
      this.articleList.splice(index, 1)
    },

    // 弹出框显示的处理函数
    displayDialog (artID) {
      this.showDialog = true
      this.nowArticleID = artID // 函数接收对应文章的id，并赋值给子组件标签
    },

    // 获取文章数据
    async getArticleList () {
      // 调用api函数
      // 参数对象
      const obj = {
        channel_id: this.channelID,
        timestamp: this.ts
      }
      const result = await apiArticleList(obj)
      // console.log(result)
      // this.articleList = result.results

      // 不要将获取到的结果直接赋值给articleList,因为这样只会渲染10条数据，不会有上拉刷新，加载更多数据的结果
      // 将获取到的数据return出去，给上拉刷新的函数使用
      // 注意点：因为该函数，是async修饰的，所以return出去的也是一个Promise对象，需要async修饰
      return result
    },

    // 上拉--瀑布流执行的函数
    async onLoad () {
      // 设置加载时的延迟效果
      await this.$sleep(1000)

      // 1.调用getArticleList()函数，获取文章数据
      // articles就是getArticleList()函数，return出来的结果，即articles = result
      const articles = await this.getArticleList()

      // 2.对获取的数据做处理
      // articleList接收数据，要设置"追加"，不要直接赋值
      // 直接赋值会使得瀑布的数据区域填充不满，会造成瀑布不断加载的效果
      // articles.results = result.results
      // articles.results:[{id,title,xx},{id,title,xx},{id,title,}……]
      // ...articles.results:是展开运算符，将results里面的对象成员暴露出来，进而被push追加使用
      // this.articleList.push({id,title,xx},{id,title,xx},{id,title,}……)
      if (articles.results.length > 0) {
        this.articleList.push(...articles.results)

        // 更新时间戳，方便获取"下一页"数据
        this.ts = articles.pre_timestamp
      } else {
        // 若没有数据可追加，说明已全部加载完成，修改finished的值为true
        this.finished = true
      }

      // 3.获取到数据后，停止动画的加载效果
      this.loading = false

      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }

      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true // 数据已全部加载完毕，将finished改为true
      //   }
      // }, 1000)
    },

    // 下拉--执行的函数
    async onRefresh () {
      // 延迟器1秒
      await this.$sleep(1000)

      // 获得文章数据
      const articles = await this.getArticleList()
      if (articles.results.length > 0) {
        this.articleList.unshift(...articles.results)
        // 更新时间戳
        this.ts = articles.pre_timestamp
        // 提示信息
        this.successText = '文章更新成功'
      } else {
        // 提示：已经是最新的了
        this.successText = '文章已经是最新的了'
      }

      // 结束加载动画
      this.isLoading = false

      // setTimeout(() => {
      //   this.onLoad() // 调用上拉函数，获得数据
      //   this.$toast.success('刷新成功') // 下拉加载成功的提示信息
      //   this.isLoading = false // 下拉加载完成后，结束加载动画
      // }, 1000)
    }
  }
}
</script>

<style scoped lang="less" >
// 给上拉列表区域设置样式
.scroll-wrapper {
  height: 100%;
  // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
  // 是瀑布实现的关键要素
  overflow-y: auto;
}
</style>
