/**
 * gallery.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% gallery [width:max] [effect:cards] %}
 * ![img](src)
 * {% endgallery %}
 */

'use strict'

module.exports = ctx => function(args, content) {
  args = ctx.args.map(args, ['captions', 'rowHeight', 'maxRowCount', 'margins', 'border', 'lastRow']);
  var el = '';
  var id = Math.random().toString(36).slice(2);
  function slide() {
    let imgs = ctx.render.renderSync({text: content, engine: 'markdown'});
    imgs = imgs.match(/<img(.*?)src="(.*?)"(.*?)>/gi);
    if (imgs && imgs.length > 0) {
      imgs.forEach((img, i) => {
        // img = img.replace('<img src', '<img src');
        var caption = img.match(/\salt=['"](.*?)['"]/)[1];
        var href = img.match(/\ssrc=['"](.*?)['"]/)[1];//.slice(5,-1);
        el += '<a data-fancybox="' + id + '" data-caption="' + caption + '" href="' + href + '">';
        el += img;
        el += '</a>';
      })
    }
  }
  // 参数未处理
  // ' ' + ctx.args.joinTags(args, ['width', 'effect']).join(' ')
  // 赋予其唯一的ID
  el += '<div id="'+id+'" class="justified-gallery">'
  slide()
  el += '</div>'
  return el
}