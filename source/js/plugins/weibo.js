const weibojs = {
  requestAPI: (url, callback, timeout) => {
    let retryTimes = 5;
    function request() {
      return new Promise((resolve, reject) => {
        let status = 0; // 0 等待 1 完成 2 超时
        let timer = setTimeout(() => {
          if (status === 0) {
            status = 2;
            timer = null;
            reject('请求超时');
            if (retryTimes == 0) {
              timeout();
            }
          }
        }, 5000);
        fetch(url).then(function(response) {
          if (status !== 2) {
            clearTimeout(timer);
            resolve(response);
            timer = null;
            status = 1;
          }
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        }).then(function(data) {
          retryTimes = 0;
          callback(data);
        }).catch(function(error) {
          if (retryTimes > 0) {
            retryTimes -= 1;
            setTimeout(() => {
              request();
            }, 5000);
          } else {
            timeout();
          }
        });
      });
    }
    request();
  },
  layoutDiv: (cfg) => {
    const el = $(cfg.el)[0];
    $(el).append('<div class="loading-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" stroke-opacity=".3" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0"/></path><path stroke-dasharray="15" stroke-dashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg></div>');
    weibojs.requestAPI(cfg.api, function(data) {
      $(el).find('.loading-wrap').remove();
      const arr = data.tweets || [];
      const limit = el.getAttribute('limit');
      arr.forEach((item, i) => {
        if (limit && i >= limit) {
          return;
        }
        var cell = '<div class="timenode" index="' + i + '">';
        cell += '<div class="header">';
        cell += '<div class="user-info">';
        cell += '<img src="' + (data.user.avatar_hd || cfg.avatar) + '" onerror="javascript:this.src=\'' + cfg.avatar + '\';">';
        cell += '<span>' + data.user.nick_name + '</span>';
        cell += '</div>';
        cell += '<p>' + item.created_at + '</p>';
        cell += '</div>';
        cell += '<div class="body" style="width: 100%">';
        cell += item.content;
        cell += '<div class="footer">';
        cell += '<div class="flex left">';
        cell += '</div>';
        cell += '<div class="flex right">';
        cell += '<a class="item comments last" href="' + item.url + '#issuecomment-new" target="_blank" rel="external nofollow noopener noreferrer">';
        cell += '<span>' + '<i class="fa-solid fa-link"></i>' + ' ' + item.reposts_count + '</span>';
        cell += '</a>';
        cell += '<a class="item comments last" href="' + item.url + '#issuecomment-new" target="_blank" rel="external nofollow noopener noreferrer">';
        cell += '<span><i class="fa-solid fa-comment"></i>'+' ' + (item.comments_count || 0) + '</span>';
        cell += '</a>';
        cell += '<a class="item comments last" href="' + item.url + '#issuecomment-new" target="_blank" rel="external nofollow noopener noreferrer">';
        cell += '<span>' + '<i class="fa-solid fa-thumbs-up"></i>' + ' ' + item.attitudes_count + '</span>';
        cell += '</a>';
        cell += '</div>';
        cell += '</div>';
        // 右下角结束
        $(el).append(cell);
        var els = $(el).find('.justified-gallery');
        console.log(els)
        for (var j = 0; j<els.length; j++){
          var elj = els[j];
          var id = "#" + elj.getAttribute('id');
          console.log(id)
          loadFancybox(()=>{justified_gallery(id)});
        }
      });
    }, function() {
      $(el).find('.loading-wrap svg').remove();
      $(el).find('.loading-wrap').append('<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M12 3L21 20H3L12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 10V14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0"/></path></g><circle cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1"/></circle></svg>');
      $(el).find('.loading-wrap').addClass('error');
    });
  },
}

$(function () {
  const els = document.getElementsByClassName('stellar-weibo-api');
  for (var i = 0; i < els.length; i++) {
    const el = els[i];
    const api = el.getAttribute('api');       // 这个API可以返回微博的json文件
    if (api == null) {
      continue;
    }
    var cfg = new Object();
    cfg.el = el;
    cfg.api = api;
    cfg.avatar = 'https://gcore.jsdelivr.net/gh/cdn-x/placeholder@1.0.4/avatar/round/3442075.svg';
    weibojs.layoutDiv(cfg);
  }
});
