// 按需导入extend函数
// 1.导入localize函数，以实现语言配置
import { extend, localize } from 'vee-validate'

// 导入全部规则
import * as rules from 'vee-validate/dist/rules'

// 2. 导入需要的语言包
import zhCN from 'vee-validate/dist/locale/zh_CN.json'

// 3. 注册语言包(对象成员简易赋值 zhCN:zhCN)
localize({ zhCN })

// 4. 激活当前语言
localize('zhCN')

// rules:是一个大对象，里面包括导入的各个规则成员
// Object.keys(rules): 返回该对象全部成员名称，以"数组"形式返回 ['required','length','email'……]
// extend是vee-validate固定函数，用作规则“注册”使用的
// rule:代表各个规则名称
// rules[rule]:代表该规则对应的具体的规则内容

// 遍历导入的全部规则
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

// 配置自定义校验规则
// phone：规则名称
// value：被校验的数据
// message:错误提示信息
extend('phone', {
  validate: value => {
    // 校验成功返回true，否则返回false
    // 定义手机正则，匹配
    const reg = /^1[35789]\d{9}$/
    return reg.test(value)
    // return value % 2 !== 0;
  },
  // {_field_} 代表 ValidationProvider 的name属性值
  message: '{_field_}格式不正确'
})
