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
