/**
 * gallery.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% gallery %}
 * ![img](src)
 * {% endgallery %}
 */

'use strict'

module.exports = ctx => function(args, content) {
  // TODO : 解析这些参数，并在 main.js 文件中调用。
  args = ctx.args.map(args, ['captions', 'rowHeight', 'maxRowCount', 'margins', 'border', 'lastRow']);
  var el = '';
  var id = Math.random().toString(36).slice(2);
  function slide() {
    let imgs = ctx.render.renderSync({text: content, engine: 'markdown'});
    imgs = imgs.match(/<img(.*?)src="(.*?)"(.*?)>/gi);
    if (imgs && imgs.length > 0) {
      imgs.forEach((img, i) => {
        // WARN: 不应当懒加载，需要获取图片长宽信息。
        img = img.replace('<img src', '<img no-lazy src');
        var caption = img.match(/\salt=['"](.*?)['"]/)[1];
        var href = img.match(/\ssrc=['"](.*?)['"]/)[1];//.slice(5,-1);
        // HACK: 对于图片 `https://githubimages.pengfeima.cn/images/${filename}.${suffix}` 都有略缩图
        //               `https://githubimages.pengfeima.cn/images/compressed/${filename}webp`
        var href_ = href.match(/https\:\/\/githubimages\.pengfeima\.cn\/images\/[0-9,\-]+\./);
        if (href_){
          var filename = href_[0].split('/')[4];
          var href_thumbnail = `https://githubimages.pengfeima.cn/images/compressed/${filename}webp`
          img = img.replace(href, href_thumbnail);
        }
        el += '<a data-fancybox="' + id + '" data-caption="' + caption + '" href="' + href + '">';
        el += img;
        el += '</a>';
      })
    }
  }
  // 参数未处理
  // ' ' + ctx.args.joinTags(args, ['width', 'effect']).join(' ')
  // 赋予其唯一的ID
  el += '<div id="'+id+'" class="justified-gallery tile-gallery">'
  slide()
  el += '</div>'
  return el
}