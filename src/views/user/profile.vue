<template>
  <div class="page-user-profile">
    <!-- @click-right:是 van-nav-bar 组件提供的点击右侧按钮时触发的函数-->
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save()"
    ></van-nav-bar>
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
      <van-cell title="头像" is-link center @click="showPhoto=true">
        <van-image slot="default" round width="56" height="56" fit="cover" :src="userProfile.photo"></van-image>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="showName=true"></van-cell>
      <van-cell title="性别" is-link :value="userProfile.gender===0?'男':'女'" @click="showGender=true"></van-cell>
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="showBirthday=true"></van-cell>
    </van-cell-group>

    <!-- 头像的弹出层 -->
    <van-popup v-model="showPhoto" position="bottom">
      <!--单击后要触发上传头像表单域的click事件执行，就是要展开选取图片的框框  通过间接触发执行-->
      <van-cell title="本地相册选择图片" is-link @click="$refs.mypic.click()"></van-cell>
      <van-cell title="拍照" is-link></van-cell>
    </van-popup>

    <!-- 昵称的弹出层 -->
    <van-popup v-model="showName" position="bottom">
      <van-field v-model.trim="userProfile.name" type="textarea" rows="3"></van-field>
    </van-popup>

    <!-- 性别的弹出层(上拉菜单)
         v-model="showGender" 设置弹层是否显示
         :actions="genderMeuns" 设定上拉菜单项目的
         @select="onSelect" 单击到某一个菜单项目后的回调处理：收起菜单，选中项目
         cancel-text="取消" 设置有取消按钮提示
    -->
    <van-action-sheet
      v-model="showGender"
      :actions="genderMeuns"
      @select="onSelect"
      cancel-text="取消"
    ></van-action-sheet>

    <!-- 生日的弹出层(弹出层 + 时间选择器) -->
    <van-popup v-model="showBirthday" position="bottom">
      <!-- 时间选择器
             type="date" ‘年月日’类型选择
             v-model="currentDate" 默认当前的显示时间
             :min-date 最小选取时间范围 例：1900年
             :max-date 最大选取时间范围 现在设置为：当前时间(因为是生日)
             注意：当前各个时间类型都是  new Date() 对象格式，时间选择器要求的
             @confirm="onConfirm" 单击确认按钮后的回调处理，可以获得选中的时间信息，注意不要设置()
             @cancel: 单击取消按钮后的事件处理函数，这里只是将弹出层关闭即可，所以，直接设置成了表达式
      -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="showBirthday=false"
      ></van-datetime-picker>
    </van-popup>

    <!-- 隐藏状态的---头像上传表单域 -->
    <!-- ref：可以这样 this.$refs.mypic  方式获得到当前input的元素对象
         如果不通过ref，也可以通过其他方式获取，
         例如id  document.getElementById('pic')
         ref和id 方式获得的元素对象本质完全一样
        上传表单域自带click，不用声明

        @change：事件，感知表单域的变化信息，并做收集处理
        style="display:none; 让该表单域隐藏，不去显示
    -->
    <input type="file" ref="mypic" id="pic" @change="startUpload()" style="display:none;" />
  </div>
</template>

<script>
// 导入dayjs模块
import dayjs from 'dayjs'

// 导入获取“用户个人资料的”api函数
// 导入 上传用户头像 的api函数
// 导入 “更新用户资料”的api函数
import {
  apiUserProfile,
  apiUserPhoto,
  apiUserSaveProfile
} from '@/api/user.js'

export default {
  name: 'user-profile',
  data () {
    return {
      showPhoto: false, // 头像的弹出层开关
      showName: false, // 昵称的弹出层开关
      showGender: false, // 性别的弹出层开关
      showBirthday: false, // 生日的弹出层开关

      genderMeuns: [{ name: '男' }, { name: '女' }], // 性别的菜单选项,语法结构固定，name属性固定

      // 时间选择器的相关信息数据
      currentDate: new Date(), // 当前默认显示的时间
      minDate: new Date(2008, 0, 1), // 最小选取时间限制（月份是从0开始）
      maxDate: new Date(2028, 0, 1), // 最大选取时间限制

      // 用户个人资料的信息列表
      userProfile: {
        name: '',
        photo: '',
        gender: '',
        birthday: ''
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    // 更新用户资料的处理函数-------------------------------------------------
    // userProfile已经通过各种弹出层都丰富好了，使用应用即可
    async save () {
      await apiUserSaveProfile(this.userProfile)
      this.$toast.success('更新用户资料成功')
    },

    // 开始上传头像-------------------------------------------------------
    // 头像图片选取好了，该函数会自动触发执行
    async startUpload () {
      // console.dir() 可以输出元素对象的各个子成员
      // console.dir(this.$refs.mypic) // 输出上传文件域对象, 包含files成员  files: FileList {0: File, length: 1}
      // this.$refs.mypic：获得type="file" 的上传附件表单域的dom对象
      // this.$refs.mypic.files[0] ：获得上传图片的对象内容

      // 1. 获得上传好的图片对象
      const photoObj = this.$refs.mypic.files[0]

      // 2. 把图片对象 整合到FormData
      const fd = new FormData()
      fd.append('photo', photoObj) // photo 是接口文章要求的参数名称

      // 3. 把FormData给到api函数，提交给服务器端
      const result = await apiUserPhoto(fd)

      // 把服务器端上传好并返回的头像信息更新显示到页面上
      // 本质给到userprofile.photo
      this.userProfile.photo = result.photo

      // 成功的提示信息
      this.$toast.success('头像更新成功!')

      // 关闭弹出层
      this.showPhoto = false
    },

    // 时间选择器，确认选取时间了----------------------------------------
    // val:代表当前选中的时间，根据组件提供的 confirm事件中可知
    onConfirm (val) {
      // console.log(val) // Tue Jan 01 2008 00:00:00 GMT+0800 (中国标准时间)
      // console.log(typeof val) // object 是对象格式的
      // 但是，时间选择器 要求上传的日期格式必须是 年-月-日 格式的  所以需将 对象格式 进行转换
      // 通过使用dayjs模块，来实现格式的转换 对象格式---> 年-月-日 格式

      this.userProfile.birthday = dayjs(val).format('YYYY-MM-DD')
      // console.log(dayjs(val))

      this.showBirthday = false // 关闭弹出层
    },

    // 性别选择后的回调处理函数-----------------------------------------
    onSelect (val) {
      // val: 代表被选中项目的对象数据
      // console.log(val) // {name:'男'}

      // 对val进行处理，然后赋值给data表单成员(其接受数字的性别)
      this.userProfile.gender = val.name === '男' ? 0 : 1
      this.showGender = false // 关闭弹出层
    },

    // 获取用户个人资料的函数------------------------------------------
    async getUserProfile () {
      this.userProfile = await apiUserProfile()

      // 把用户生日转为 new Date()  格式，赋值给 currentDate
      // 使得选择器 默认显示
      this.currentDate = new Date(this.userProfile.birthday)
    }
  }
}
</script>

<style scoped lang='less'></style>
