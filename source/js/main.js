console.log('\n' + '%c Stellar v' + stellar.version + ' %c\n' + stellar.github + '\n', 'color:#e8fafe;background:#03c7fa;padding:8px;border-radius:4px', 'margin-top:8px');
// utils
const util = {

  // https://github.com/jerryc127/hexo-theme-butterfly
  diffDate: (d, more = false) => {
    const dateNow = new Date()
    const datePost = new Date(d)
    const dateDiff = dateNow.getTime() - datePost.getTime()
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 30

    let result
    if (more) {
      const monthCount = dateDiff / month
      const dayCount = dateDiff / day
      const hourCount = dateDiff / hour
      const minuteCount = dateDiff / minute

      if (monthCount > 12) {
        result = null
      } else if (monthCount >= 1) {
        result = parseInt(monthCount) + ' ' + stellar.config.date_suffix.month
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + ' ' + stellar.config.date_suffix.day
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + ' ' + stellar.config.date_suffix.hour
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + ' ' + stellar.config.date_suffix.min
      } else {
        result = stellar.config.date_suffix.just
      }
    } else {
      result = parseInt(dateDiff / day)
    }
    return result
  },

  copy: (id, msg) => {
    const el = document.getElementById(id);
    if (el) {
      el.select();
      document.execCommand("Copy");
      if (msg && msg.length > 0) {
        hud.toast(msg);
      }
    }
  },

  toggle: (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle("display");
    }
  },
}

const hud = {
  toast: (msg, duration) => {
    duration = isNaN(duration) ? 2000 : duration;
    var el = document.createElement('div');
    el.classList.add('toast');
    el.innerHTML = msg;
    document.body.appendChild(el);
    setTimeout(function () {
      var d = 0.5;
      el.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      el.style.opacity = '0';
      setTimeout(function () { document.body.removeChild(el) }, d * 1000);
    }, duration);
  },

}

// defines

const l_body = document.querySelector('.l_body');

const sidebar = {
  toggle: () => {
    if (l_body) {
      l_body.classList.add('mobile');
      l_body.classList.toggle("sidebar");
    }
  }
}

const init = {
  toc: () => {
    stellar.jQuery(() => {
      const scrollOffset = 32;
      var segs = [];
      $("article.md-text :header").each(function (idx, node) {
        segs.push(node)
      });
      // 定位到激活的目录树（不如pjax体验好）
      // const widgets = document.querySelector('.widgets')
      // const e1 = document.querySelector('.doc-tree-link.active')
      // const offsetTop = e1.getBoundingClientRect().top - widgets.getBoundingClientRect().top - 100
      // if (offsetTop > 0) {
      //   widgets.scrollBy({top: offsetTop, behavior: 'smooth'})
      // }
      // 滚动
      $(document, window).scroll(function (e) {
        var scrollTop = $(this).scrollTop();
        var topSeg = null
        for (var idx in segs) {
          var seg = $(segs[idx])
          if (seg.offset().top > scrollTop + scrollOffset) {
            continue
          }
          if (!topSeg) {
            topSeg = seg
          } else if (seg.offset().top >= topSeg.offset().top) {
            topSeg = seg
          }
        }
        if (topSeg) {
          $("#data-toc a.toc-link").removeClass("active")
          var link = "#" + topSeg.attr("id")
          if (link != '#undefined') {
            const highlightItem = $('#data-toc a.toc-link[href="' + encodeURI(link) + '"]')
            if (highlightItem.length > 0) {
              highlightItem.addClass("active")
              const e0 = document.querySelector('.widgets')
              const e1 = document.querySelector('#data-toc a.toc-link[href="' + encodeURI(link) + '"]')
              const offsetBottom = e1.getBoundingClientRect().bottom - e0.getBoundingClientRect().bottom + 100
              const offsetTop = e1.getBoundingClientRect().top - e0.getBoundingClientRect().top - 64
              if (offsetTop < 0) {
                e0.scrollBy(0, offsetTop)
              } else if (offsetBottom > 0) {
                e0.scrollBy(0, offsetBottom)
              }
            }
          } else {
            $('#data-toc a.toc-link:first').addClass("active")
          }
        }
      })
    })
  },
  sidebar: () => {
    stellar.jQuery(() => {
      $("#data-toc a.toc-link").click(function (e) {
        l_body.classList.remove("sidebar");
      });
    })
  },
  relativeDate: (selector) => {
    selector.forEach(item => {
      const $this = item
      const timeVal = $this.getAttribute('datetime')
      let relativeValue = util.diffDate(timeVal, true)
      if (relativeValue) {
        $this.innerText = relativeValue
      }
    })
  },
  /**
   * Tabs tag listener (without twitter bootstrap).
   */
  registerTabsTag: function () {
    // Binding `nav-tabs` & `tab-content` by real time permalink changing.
    document.querySelectorAll('.tabs .nav-tabs .tab').forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        // Prevent selected tab to select again.
        if (element.classList.contains('active')) return;
        // Add & Remove active class on `nav-tabs` & `tab-content`.
        [...element.parentNode.children].forEach(target => {
          target.classList.toggle('active', target === element);
        });
        // https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
        const tActive = document.getElementById(element.querySelector('a').getAttribute('href').replace('#', ''));
        [...tActive.parentNode.children].forEach(target => {
          target.classList.toggle('active', target === tActive);
        });
        // Trigger event
        tActive.dispatchEvent(new Event('tabs:click', {
          bubbles: true
        }));
      });
    });

    window.dispatchEvent(new Event('tabs:register'));
  },

}


// init
init.toc()
init.sidebar()
init.relativeDate(document.querySelectorAll('#post-meta time'))
init.registerTabsTag()

// scrollreveal
if (stellar.plugins.scrollreveal) {
  stellar.loadScript(stellar.plugins.scrollreveal.js).then(function () {
    ScrollReveal().reveal("body .reveal", {
      distance: stellar.plugins.scrollreveal.distance,
      duration: stellar.plugins.scrollreveal.duration,
      interval: stellar.plugins.scrollreveal.interval,
      scale: stellar.plugins.scrollreveal.scale,
      easing: "ease-out"
    });
  })
}

// lazyload
if (stellar.plugins.lazyload) {
  stellar.loadScript(stellar.plugins.lazyload.js, { defer: true })
  // https://www.npmjs.com/package/vanilla-lazyload
  // Set the options globally
  // to make LazyLoad self-initialize
  window.lazyLoadOptions = {
    elements_selector: ".lazy",
  };
  // Listen to the initialization event
  // and get the instance of LazyLoad
  window.addEventListener(
    "LazyLoad::Initialized",
    function (event) {
      window.lazyLoadInstance = event.detail.instance;
    },
    false
  );
  document.addEventListener('DOMContentLoaded', function () {
    window.lazyLoadInstance?.update();
  });
}


// musicplayer
if (stellar.plugins.musicplayer.enable) {
  const els = document.getElementsByClassName('stellar-musicplayer');
  if (els != undefined && els.length > 0) {
    // 加载alpayer的css文件和js文件
    stellar.loadCSS(stellar.plugins.musicplayer.aplayer.css);
    stellar.loadCSS(stellar.plugins.musicplayer.darkmode);
    stellar.loadScript(stellar.plugins.musicplayer.aplayer.js);
    // 加载flyio，之后运行脚本
    stellar.loadScript(stellar.plugins.musicplayer.flyio.js).then(function () {
    }).then(function () {
      // 运行js文件
      // WARN : 这里为什么要用jQuery？
      // 为什么有时候要用
      stellar.jQuery(() => {
        stellar.loadScript(stellar.plugins.musicplayer.assemble);
      })
    })
  }
}

// stellar js
if (stellar.plugins.stellar) {
  for (let key of Object.keys(stellar.plugins.stellar)) {
    let js = stellar.plugins.stellar[key];
    if (key == 'linkcard') {
      stellar.loadScript(js, { defer: true }).then(function () {
        setCardLink(document.querySelectorAll('a.link-card[cardlink]'));
      });
    } else {
      const els = document.getElementsByClassName('stellar-' + key + '-api');
      if (els != undefined && els.length > 0) {
        stellar.jQuery(() => {
          stellar.loadScript(js, { defer: true });
          if (key == 'timeline') {
            stellar.loadScript(stellar.plugins.marked);
          }
        })
      }
    }
  }
}

// swiper
if (stellar.plugins.swiper) {
  const swiper_api = document.getElementById('swiper-api');
  if (swiper_api != undefined) {
    stellar.loadCSS(stellar.plugins.swiper.css);
    stellar.loadScript(stellar.plugins.swiper.js, { defer: true }).then(function () {
      const effect = swiper_api.getAttribute('effect') || '';
      var swiper = new Swiper('.swiper#swiper-api', {
        slidesPerView: 'auto',
        spaceBetween: 8,
        centeredSlides: true,
        effect: effect,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    })
  }
}

// preload
if (stellar.plugins.preload) {
  if (stellar.plugins.preload.service == 'instant_page') {
    stellar.loadScript(stellar.plugins.preload.instant_page, {
      defer: true,
      type: 'module',
      integrity: 'sha384-OeDn4XE77tdHo8pGtE1apMPmAipjoxUQ++eeJa6EtJCfHlvijigWiJpD7VDPWXV1'
    })
  } else if (stellar.plugins.preload.service == 'flying_pages') {
    window.FPConfig = {
      delay: 0,
      ignoreKeywords: [],
      maxRPS: 5,
      hoverDelay: 25
    };
    stellar.loadScript(stellar.plugins.preload.flying_pages, { defer: true })
  }
}

// fancybox
if (stellar.plugins.fancybox) {
  let selector = 'img[fancybox]:not(.error)';
  if (stellar.plugins.fancybox.selector) {
    selector += `, ${stellar.plugins.fancybox.selector}`
  }
  if (document.querySelectorAll(selector).length !== 0) {
    stellar.loadCSS(stellar.plugins.fancybox.css);
    stellar.loadScript(stellar.plugins.fancybox.js, { defer: true }).then(function () {
      Fancybox.bind(selector, {
        groupAll: true,
        hideScrollbar: false,
        Thumbs: {
          autoStart: false,
        },
        caption: function (fancybox, carousel, slide) {
          return slide.$trigger.alt || null
        }
      });
    })
  }
}


if (stellar.search.service) {
  if (stellar.search.service == 'local_search') {
    stellar.jQuery(() => {
      stellar.loadScript('/js/search/local-search.js', { defer: true }).then(function () {
        var $inputArea = $("input#search-input");
        if ($inputArea.length == 0) {
          return;
        }
        var $resultArea = document.querySelector("div#search-result");
        $inputArea.focus(function () {
          var path = stellar.search[stellar.search.service]?.path || '/search.json';
          if (!path.startsWith('/')) {
            path = '/' + path;
          }
          const filter = $inputArea.attr('data-filter') || '';
          searchFunc(path, filter, 'search-input', 'search-result');
        });
        $inputArea.keydown(function (e) {
          if (e.which == 13) {
            e.preventDefault();
          }
        });
        var observer = new MutationObserver(function (mutationsList, observer) {
          if (mutationsList.length == 1) {
            if (mutationsList[0].addedNodes.length) {
              $('.search-wrapper').removeClass('noresult');
            } else if (mutationsList[0].removedNodes.length) {
              $('.search-wrapper').addClass('noresult');
            }
          }
        });
        observer.observe($resultArea, { childList: true });
      });
    })
  }
}


// heti
if (stellar.plugins.heti) {
  stellar.loadCSS(stellar.plugins.heti.css);
  stellar.loadScript(stellar.plugins.heti.js, { defer: true }).then(function () {
    const heti = new Heti('.heti');

    // Copied from heti.autoSpacing() without DOMContentLoaded.
    // https://github.com/sivan/heti/blob/eadee6a3b748b3b7924a9e7d5b395d4bce479c9a/js/heti-addon.js
    //
    // We managed to minimize the code modification to ensure .autoSpacing()
    // is synced with upstream; therefore, we use `.bind()` to emulate the 
    // behavior of .autoSpacing() so we can even modify almost no code.
    void (function () {
      const $$rootList = document.querySelectorAll(this.rootSelector)

      for (let $$root of $$rootList) {
        this.spacingElement($$root)
      }
    }).bind(heti)();

    stellar.plugins.heti.enable = false;
  });
}



// 显示相册
loadFancybox = (fn) => {
  if (typeof  Fancybox === 'undefined') {
    stellar.loadCSS(stellar.plugins.fancybox.css);
    stellar.loadScript(stellar.plugins.fancybox.js).then(fn);
  } else {
    fn()
  }
}

function justified_gallery(container){
  $(container).justifiedGallery( 
    {
      lastRow : 'left', 
      captions: false,
      margins : 3,
      border: -1
    }
  ).on('jg.complete', function () {
    Fancybox.bind(container+" a", {
      caption: function (fancybox, carousel, slide) {
        // return `<center>${slide.index + 1} / ${carousel.slides.length} <br></center>` + slide.caption
        return slide.caption
      }
    });
  });
};



stellar.loadCSS(stellar.plugins.gallery.justified_gallery.css);
stellar.jQuery(() => {
  stellar.loadScript(stellar.plugins.gallery.justified_gallery.js).then(()=>{
    var els = document.getElementsByClassName('tile-gallery');
    for (var i = 0; i<els.length; i++){
      var el = els[i];
      var id = "#" + el.getAttribute('id');
      loadFancybox(()=>{justified_gallery(id)});
    }
  });
});


console.log("hello world!");


// stellar.loadCSS(stellar.plugins.musicplayer.aplayer.css);
// stellar.loadCSS(stellar.plugins.musicplayer.darkmode);
// stellar.loadScript(stellar.plugins.musicplayer.aplayer.js).then(()=>{
//   const ap = new APlayer({
//     container: document.getElementById('global-player'),
//     fixed: true,
//     lrcType: 1,
//     // lrcType: 3,
//     audio: [{
//         name: '喜欢',
//         artist: '张悬',
//         url: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/453927771.mp3',
//         cover: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/453927771.png',
//         lrc: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/453927771.lrc',
//     },{
//       name: 'The White Lady',
//       artist: 'Christopher Larkin',
//       url: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/1309394503.mp3',
//       cover: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/1309394503.png',
//       lrc: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/1309394503.lrc',
//     }
//   ]
//   });
// })


// PJAX，跳转界面时继续播放音乐
// Errors: 很多地方都有问题
// stellar.jQuery(() => {
//   stellar.loadScript('https://cdn.bootcss.com/jquery.pjax/2.0.1/jquery.pjax.min.js').then(()=>{
//     $(document).pjax('a[target!=_blank]', '#pageContent', {fragment: '#pageContent'});
//   }
//   )
// });



stellar.loadCSS(stellar.plugins.gallery.justified_gallery.css);
stellar.jQuery(() => {
  stellar.loadScript(stellar.plugins.gallery.justified_gallery.js).then(()=>{
    // words for random pictures
    var words = ['snow','winter','pine','christmas','year','decision', 'trip','mother','santa','mountain'];
    $('#0x1e8af9929').justifiedGallery(
      {
        rowHeight:300,
        lastRow : 'left', 
        captions: false,
        margins : 9,
        border: -1
      }
    )
    for (var i = 0; i < 100; i++) {
      var img_size = parseInt(300+Math.random()*600) + 'x' + parseInt(300+Math.random()*300);
      var href = "https://dummyimage.com/" + img_size + "/0f59a4/fff"
      $('#0x1e8af9929').append('<a><img src="'+ href +'" /></a>');
      $('#0x1e8af9929').justifiedGallery('norewind');    
    }
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() +1 > $(document).height()) {
        for (var i = 0; i < 10; i++) {
          var random_param = words[Math.floor(Math.random()*words.length)]
          random_param = random_param + ',' + words[Math.floor(Math.random()*words.length)];
          random_param = random_param + ',' + words[Math.floor(Math.random()*words.length)];
          random_param = random_param + ',' + words[Math.floor(Math.random()*words.length)];
          var href = '"https://source.unsplash.com/random?' + random_param +'"';
          var img = `<a><img src=${href} /></a>`;
          $('#0x1e8af9929').append(img);
        }
        $('#0x1e8af9929').justifiedGallery('norewind');
      }
    });
  });
});



const InfiniteScrollGallery = {
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
    InfiniteScrollGallery.requestAPI(cfg.api, function(data) {
      $(el).find('.loading-wrap').remove();
      // words for random pictures
      console.log("#" + cfg.id);
      console.log(data);
      var words = ['snow','winter','pine','christmas','year','decision', 'trip','mother','santa','mountain'];
      // 初始化
      $("#" + cfg.id).justifiedGallery(
        {
          lastRow : 'left', 
          captions: false,
          margins : 3,
          border: -1
        }
      )
      // 20幅占位图
      for (var i = 0; i < 20; i++) {
        var img_size = parseInt(300+Math.random()*600) + 'x' + parseInt(300+Math.random()*300);
        var img = '<a><img src="https://dummyimage.com/'+ img_size +'/000/ffffff.png" /></a>';
        $("#" + cfg.id).append(img);
        console.log(img);
        $("#" + cfg.id).justifiedGallery('norewind');    
      }
      // 挑选出图片
      var pictures_list = [];
      data.forEach((item, i) => {
        console.log(item);
        console.log(i);
        console.log(item.name);
        temp_name = item.name.split('.');

        console.log(temp_name);
        if (temp_name[temp_name.length-1] == 'jpg' || temp_name[temp_name.length-1] == 'webp'){
          pictures_list.push(item.name)
        }
      });
      // 窗口滚动时增加图片
      $(window).scroll(function() {
        
        console.log($(window).scrollTop());
        console.log($(window).scrollTop());
        console.log($(window).scrollTop());

        if($(window).scrollTop() + $(window).height() +1 > $(document).height()) {
          for (var i = 0; i < 10; i++) {
            var picture = pictures_list.pop();
              console.log(picture);
              if (picture) {
              var href = cfg.cdn + picture;
              var img = `<a><img src=${href} /></a>`;
              $("#" + cfg.id).append(img);
              console.log(img);
            }
          }
          $("#" + cfg.id).justifiedGallery('norewind');
        }
      });

    }, function() {
      $(el).find('.loading-wrap svg').remove();
      $(el).find('.loading-wrap').append('<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M12 3L21 20H3L12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 10V14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0"/></path></g><circle cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1"/></circle></svg>');
      $(el).find('.loading-wrap').addClass('error');
    });
  },  
}



stellar.loadCSS(stellar.plugins.gallery.justified_gallery.css);
stellar.jQuery(() => {
  stellar.loadScript(stellar.plugins.gallery.justified_gallery.js).then(()=>{
    var cfg = new Object();
    cfg.api = "https://api.github.com/repos/shaoyaoqian/images-1/contents/images/compressed";
    cfg.cdn = "https://githubimages.pengfeima.cn/images/compressed/";
    cfg.id  = "0xje8cj39d0e";
    if (document.getElementById(cfg.id)) {
      InfiniteScrollGallery.layoutDiv(cfg);
    }
  });
});

stellar.loadCSS(stellar.plugins.gallery.justified_gallery.css);
stellar.jQuery(() => {
  stellar.loadScript(stellar.plugins.gallery.justified_gallery.js).then(()=>{
    var cfg = new Object();
    cfg.api = "https://api.github.com/repos/mfmpf/weibo-jhm/contents/output/picture?ref=output";
    cfg.cdn = "https://raw.githubusercontent.com/mfmpf/weibo-jhm/output/output/picture/";
    cfg.id  = "0xjd804kca3i";
    if (document.getElementById(cfg.id)) {
      InfiniteScrollGallery.layoutDiv(cfg);
    }
  });
});
