module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue是根值，是px向rem转换的砝码
      // rem = px/rootValue  除法计算
      // 200px/37.5 = 5.3333rem
      // vant设计稿的大小是375px宽度的，rootValue就是设计稿的1/10，就是37.5
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

// 解决rem适配的兼容问题
const {
  sep
} = require('path')

module.exports = ({
  file
}) => {
  const rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5 // 遇到vant就是 37.5
    : 75 // 遇到普通标签就是 75

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}
