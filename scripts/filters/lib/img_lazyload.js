/**
 * img_lazyload.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 *
 */

'use strict';

const fs = require('hexo-fs');

function lazyProcess(htmlContent) {
  console.log("hello");
  return htmlContent.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, function(imgTag, src_before, src_value, src_after) {
    console.log(imgTag);
    var href = imgTag.match(/\ssrc=['"](.*?)['"]/)[1];
    var href_ = href.match(/https\:\/\/githubimages\.pengfeima\.cn\/images\/[0-9,\-]+\./);
    if (href_){
      var filename = href_[0].split('/')[4];
      var href_thumbnail = `https://githubimages.pengfeima.cn/images/compressed/${filename}webp`
      var href_all = `${href_thumbnail}" data-src="${href}" fancybox="true`
      imgTag = imgTag.replace(href, href_all);
      console.log(imgTag);
    }
    return imgTag;
  });
}

module.exports.processSite = function(htmlContent) {
  return lazyProcess.call(this, htmlContent);
};
