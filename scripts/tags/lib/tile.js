/**
 * tile.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% tile columns:3 %}
 * ![img](src)
 * {% endtile %}
 */

'use strict'

module.exports = ctx => function(args, content) {
  args = ctx.args.map(args, ['width', 'effect'])
  var el = ''
  function slide() {
    let imgs = ctx.render.renderSync({text: content, engine: 'markdown'})
    imgs = imgs.match(/<img(.*?)src="(.*?)"(.*?)>/gi)
    if (imgs && imgs.length > 0) {
      console.log(el);
      imgs.forEach((img, i) => {
        // img = img.replace('<img src', '<img no-lazy src')
        el += '<div class="card" >' 
           + img 
           + '</div>'
      })
    }
  }


  // el += '<div class="tag-plugin gallery tile" id="tile-api">'
  el += '<div class="cards" id="' + Math.random().toString(36).slice(2) + '">'
  slide()
  el += '</div>'
  // el += '</div>'
  return el
}