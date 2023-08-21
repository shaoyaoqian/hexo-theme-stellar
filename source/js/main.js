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
        rowHeight:100,
        maxRowsCount:200,
        lastRow:'nojustify',
        captions:true,
        randomize: false,
        margins : 9,
        border: -1
      }
    )
    var index = 0;
    for (var i = 0; i < 600; i++) {
      var img_size = parseInt(300+Math.random()*600) + 'x' + parseInt(300+Math.random()*300);
      // var colors = ['a61b29','0f59a4','0f95b0','f1939c','7a7374','15559a','2775b6'];
      // var colors_name = ['苋菜红','飞燕草蓝','胆矾蓝','春梅红','锌灰','海涛蓝','景泰蓝'];
      var colors = ['5c2223', 'eea2a4', '5a191b', 'f07c82', '5a1216', 'ed5a65', 'c04851', 'ee3f4d', 'c02c38', 'a7535a', 'e3b4b8', 'f0a1a8', 'f1939c', 'a61b29', '894e54', 'c45a65', 'd11a2d', 'c21f30', 'de1c31', '7c1823', '541e24', '4c1f24', '82202b', '82111f', 'ef475d', '4d1018', 'ed556a', '7a7374', 'f03752', 'e6d2d5', 'f0c9cf', 'ee2746', '2b1216', 'ee4863', 'e77c8e', '500a16', 'c27c88', '73575c', 'ee4866', '621624', 'ce5777', 'cc163a', 'f1c4cd', 'eeb8c3', '856d72', '2d0c13', '36282b', 'bf3553', 'ec9bad', '63071c', '30161c', 'eea6b7', 'e9ccd3', 'eba0b3', '4f383e', 'ed9db2', 'ec8aa4', 'ec7696', 'ea7293', 'ef82a0', 'ec2c64', 'eb507e', 'eb3c70', 'ea517f', 'de7897', 'b598a1', 'ed2f6a', 'c5708b', '33141e', '621d34', 'ef3473', '382129', '310f1b', '381924', 'e16c96', '951c48', '62102e', 'e0c8d1', 'd13c74', '4b1e2f', 'ec4e8a', 'de3f7c', 'a8456b', 'ce5e8a', '461629', 'ee2c79', 'ef498b', 'ede3e7', 'ec2d7a', '482936', '440e25', 'd2568c', 'e9d7df', 'd2357d', '36292f', 'd276a3', 'c06f98', 'cc5595', 'c35691', 'ba2f7b', '9b1e64', '5d3f51', '4e2a40', 'bc84a8', 'c08eaf', '411c35', 'ad6598', 'a35c8f', '681752', '894276', '7e2065', '8b2671', '983680', 'c8adc4', '1c0d1a', '7e1671', '1e131d', '813c85', 'd1c2d3', '3e3841', '815c94', '806d9e', 'e2e1e4', '322f3b', '8076a3', '35333c', '22202e', '131124', '302f4b', '525288', '2f2f35', 'ccccd6', '74759b', '1f2040', '2e317c', 'a7a8bd', '61649f', '2d2e36', '5e616d', '47484c', '0f1423', '131824', '475164', '2b333e', '1c2938', '101f30', '142334', '15559a', '0f59a4', '1661ab', '3170a7', '346c9c', '2775b6', '2b73af', '2474b5', '4e7ca1', '2376b7', '144a74', '93b5cf', '2177b8', '126bae', '1772b4', 'baccd9', '619ac3', '495c69', '8fb2c9', '5698c3', '11659a', '2983bb', '1677b3', 'c4cbcf', '1177b0', '2486b9', '5e7987', '74787a', 'cdd1d3', '1781b5', '66a9c9', 'd0dfe6', '2f90b9', '8abcd1', 'c3d7df', '158bb8', 'd8e3e7', 'b2bbbe', '1a94bc', '5cb3cc', '134857', '132c33', '21373d', 'b0d5df', '22a2c3', '474b4c', '63bbd0', '126e82', '0f95b0', '1491a8', 'c7d2d4', '1e9eb3', '3b818c', '0eb0c9', '29b7cb', '51c4d3', '7cabb1', '10aec2', '648e93', '93d5dc', '617172', 'c6e6e8', '869d9d', '57c3c2', 'c4d7d6', '12aa9c', '737c7b', '12a182', '1ba784', '428675', 'c0c4c3', '248067', '1a3b32', '314a43', '2c9678', '223e36', '497568', '141e1b', '69a794', '2bae85', '9abeaf', '45b787', '92b3a5', '1f2623', '83cbac', '70887d', '55bb8a', '20a162', '40a070', '1a6840', '61ac85', '68b88e', 'a4cab6', '3c9566', '5dbe8a', '207f4c', 'eef7f2', '579572', 'b9dec9', '229453', '20894d', '15231b', '66c18c', 'a4aca7', '8a988e', '9eccab', '83a78d', '485b4d', '5d655f', '6e8b74', '2b312c', 'c6dfc8', '41b349', '43b244', '253d24', '41ae3c', 'add5a2', '5e665b', '8cc269', '5bae23', 'dfecd5', 'cad3c3', '9fa39a', 'b2cf87', '96c24e', 'f0f5e5', 'b7d07a', 'd0deaa', '373834', 'bacf65', 'e2e7bf', 'bec936', 'd2d97a', 'e2d849', 'fffef8', '5e5314', 'fffef9', 'ad9e5f', 'fed71a', 'f9f4dc', 'e4bf11', 'd2b116', 'fbda41', 'eed045', 'f1ca17', 'd2b42c', 'f2ce2b', 'e2c027', '645822', 'fcd217', 'f8df70', 'dfc243', 'f8df72', 'ffd111', 'ddc871', 'fffefa', '867018', '887322', 'fcd337', '8e804b', 'fecc11', 'fccb16', 'ffc90c', 'b7ae8f', 'f8d86a', 'fbcd31', 'fcc307', 'e9ddb6', 'fcc515', 'f7e8aa', 'e8b004', 'f9c116', 'f9d770', 'fbc82f', 'f1f0ed', '5b4913', 'f6c430', 'b78d12', 'f9bd10', 'f9d367', 'd9a40e', 'ebb10d', '584717', 'f7de98', 'f9f1db', 'f4ce69', 'feba07', '8a6913', '876818', 'b6a476', 'fcb70a', 'f0d695', '87723e', 'f8e8c1', 'd6a01d', 'f7da94', 'eaad1a', 'fbb612', 'b5aa90', 'f7f4ed', 'f8bc31', 'b78b26', 'e5d3aa', '695e45', 'e5b751', 'f3bf4c', '685e48', 'fbb929', 'f9d27d', 'e2c17c', 'b4a992', 'f6dead', 'f2e6ce', 'f8e0b0', '393733', '835e1d', 'f8f4ed', 'fca104', '815f25', 'fca106', 'ffa60f', '806332', 'fbf2e3', 'fba414', 'e4dfd7', '826b48', 'dad4cb', 'bbb5ac', 'bbb5ac', 'ff9900', 'fbb957', 'dc9123', 'c09351', 'f4a83a', 'f7c173', 'e7a23f', '533c1b', 'f9e8d0', 'de9e44', 'f9cb8b', 'f9a633', 'daa45a', '553b18', '513c20', '986524', '97846c', 'e3bd8d', '4d4030', 'fb8b05', 'f8c387', 'f28e16', '503e2a', '4a4035', 'cfccc9', 'c1b2a3', '867e76', '847c74', 'fc8c23', 'fbecde', '4f4032', 'fbeee2', '81776e', '9a8878', '5d3d21', '66462a', '918072', 'd99156', 'c1651a', 'd4c4b7', 'be7e4a', '5c3719', 'de7622', 'db8540', '80766e', 'f09c5a', 'f97d1c', 'f26b1f', 'f8b37f', 'fa7e23', 'f9e9cd', 'b7a091', '945833', 'f0945d', '964d22', '954416', 'e16723', 'fc7930', 'cf7543', 'f86b1d', 'cd6227', 'f6dcce', 'd85916', 'f7cfba', 'f27635', 'e46828', 'fc6315', 'b7511d', 'ea8958', 'e8b49a', 'fb9968', 'edc3ae', '363433', '8b614d', 'aa6a4c', 'a6522c', 'fa5d19', '71361d', 'b89485', 'f68c60', 'f6ad8f', '732e12', 'f7cdbc', 'ef632b', '8c4b31', '64483d', 'f9723d', 'cf4813', 'ee8055', 'f8ebe6', '753117', '603d30', '883a1e', 'b14b28', '873d24', 'f6cec1', '5b423a', '624941', '673424', 'f43e06', 'ef6f48', 'f4c7ba', 'ed5126', 'f34718', 'f2481b', '652b1c', 'eea08c', 'f04b22', '692a1b', 'f1441d', '773d31', 'eeaa9c', 'f0ada0', '863020', 'f2e7e5', '862617', 'f5391c', 'f03f24', 'f33b1f', 'f23e23', 'f13c22', 'f05a46', 'f17666', 'f15642', 'f25a47', 'f2b9b2', '592620', 'de2a18', 'ed3321', 'f04a3a', '482522', '5c1e19', 'd42517', 'f19790', 'ab372f', '5a1f1b', 'ed3b2f', 'bdaead', 'eb261a', 'ac1f18', '483332', '481e1c', 'f1908c', 'ec2b24', 'efafad', 'f2cac9', '4b2e2b', 'ed4845', 'ed3333', '5d3131'];
      var colors_name = ['暗玉紫', '牡丹粉红', '栗紫', '香叶红', '葡萄酱紫', '艳红', '玉红', '茶花红', '高粱红', '满江红', '鼠鼻红', '合欢红', '春梅红', '苋菜红', '烟红', '莓红', '鹅冠红', '枫叶红', '唐菖蒲红', '枣红', '猪肝紫', '葡萄紫', '暗紫苑红', '殷红', '草茉莉红', '酱紫', '山茶红', '锌灰', '海棠红', '蓟粉红', '石蕊红', '淡曙红', '李紫', '石竹红', '淡茜红', '金鱼紫', '山黎豆红', '鼠背灰', '淡蕊香红', '甘蔗紫', '月季红', '尖晶玉红', '水红', '姜红', '芦灰', '茄皮紫', '苍蝇灰', '锦葵红', '粉团花红', '石竹紫', '卵石紫', '晶红', '芝兰紫', '芍药耕红', '暮云灰', '豇豆红', '报春红', '淡绛红', '凤仙花红', '霞光红', '喜蛋红', '夹竹桃红', '松叶牡丹红', '莲瓣红', '白芨红', '隐红灰', '榲桲红', '酢酱草红', '火鹅紫', '鹞冠紫', '品红', '磨石紫', '墨紫', '檀紫', '初荷红', '菜头紫', '葡萄酒红', '淡青紫', '菠根红', '海象紫', '兔眼红', '嫩菱红', '洋葱紫', '吊钟花红', '绀紫', '紫荆红', '扁豆花红', '马鞭草紫', '藏花红', '斑鸠灰', '古铜紫', '丹紫红', '丁香淡紫', '玫瑰红', '古鼎灰', '菱锰红', '樱草紫', '龙须红', '电气石红', '玫瑰紫', '苋菜紫', '紫灰', '龙睛鱼紫', '青蛤壳紫', '萝兰紫', '荸荠紫', '豆蔻紫', '扁豆紫', '牵牛紫', '芓紫', '葛巾紫', '青莲', '芥花紫', '凤信紫', '深牵牛紫', '魏紫', '乌梅紫', '桔梗紫', '淡牵牛紫', '剑锋紫', '蕈紫', '槿紫', '芡食白', '龙葵紫', '藤萝紫', '沙鱼灰', '暗龙胆紫', '暗蓝紫', '野葡萄紫', '野菊紫', '水牛灰', '远山紫', '螺甸紫', '晶石紫', '满天星紫', '淡蓝紫', '山梗紫', '牛角灰', '鱼尾灰', '瓦罐灰', '钢蓝', '燕颔蓝', '鲸鱼灰', '青灰', '鸽蓝', '暗蓝', '钢青', '海涛蓝', '飞燕草蓝', '靛青', '安安蓝', '海军蓝', '景泰蓝', '品蓝', '尼罗蓝', '蝶翅蓝', '花青', '鷃蓝', '星蓝', '虹蓝', '柏林蓝', '群青', '云水蓝', '羽扇豆蓝', '战舰灰', '晴山蓝', '睛蓝', '搪磁蓝', '潮蓝', '天蓝', '大理石灰', '牵牛花蓝', '宝石蓝', '淡蓝灰', '嫩灰', '银鱼白', '釉蓝', '涧石蓝', '远天蓝', '云山蓝', '秋波蓝', '井天蓝', '鸢尾蓝', '云峰白', '星灰', '钴蓝', '碧青', '苍蓝', '深灰蓝', '灰蓝', '湖水蓝', '海青', '黄昏灰', '霁青', '玉鈫蓝', '胆矾蓝', '樫鸟蓝', '鸥蓝', '翠蓝', '蜻蜓蓝', '孔雀蓝', '蔚蓝', '瀑布蓝', '闪蓝', '甸子蓝', '晚波蓝', '清水蓝', '夏云灰', '海天蓝', '虾壳青', '石绿', '穹灰', '美蝶绿', '垩灰', '蓝绿', '竹绿', '亚丁绿', '月影白', '海王绿', '深海绿', '绿灰', '青矾绿', '苍绿', '飞泉绿', '莽丛绿', '梧枝绿', '铜绿', '草原远绿', '蛙绿', '浪花绿', '苷蓝绿', '粉绿', '淡绿灰', '麦苗绿', '翠绿', '葱绿', '荷叶绿', '淡绿', '田园绿', '玉簪绿', '蟾绿', '蔻梢绿', '薄荷绿', '月白', '蛋白石绿', '竹篁绿', '孔雀绿', '宫殿绿', '云杉绿', '毛绿', '冰山蓝', '明灰', '明绿', '松霜绿', '白屈菜绿', '狼烟灰', '瓦松绿', '槲寄生绿', '淡翠绿', '玉髓绿', '鲜绿', '油绿', '宝石绿', '嘉陵水绿', '田螺绿', '水绿', '鹦鹉绿', '艾背绿', '艾绿', '镍灰', '橄榄石绿', '芽绿', '嫩菊绿', '芦苇绿', '姚黄', '蒽油绿', '苹果绿', '海沬绿', '橄榄黄绿', '槐花黄绿', '蝶黄', '象牙白', '橄榄绿', '雪白', '淡灰绿', '佛手黄', '乳白', '香蕉黄', '新禾绿', '油菜花黄', '秋葵黄', '柚黄', '草黄', '硫华黄', '姜黄', '潭水绿', '金瓜黄', '麦秆黄', '蒿黄', '茉莉黄', '藤黄', '芒果黄', '海参灰', '碧螺春绿', '苔绿', '柠檬黄', '草灰绿', '向日葵黄', '素馨黄', '乳鸭黄', '月灰', '葵扇黄', '大豆黄', '金盏黄', '菊蕾白', '黄连黄', '杏仁黄', '谷黄', '木瓜黄', '淡茧黄', '雅梨黄', '银白', '棕榈绿', '鹦鹉冠黄', '枯绿', '浅烙黄', '淡密黄', '芥黄', '栀子黄', '暗海水绿', '篾黄', '蚌肉白', '炒米黄', '琥珀黄', '灰绿', '粽叶绿', '尘灰', '鼬黄', '象牙黄', '鲛青', '豆汁黄', '土黄', '香水玫瑰黄', '虎皮黄', '鸡蛋黄', '银鼠灰', '鱼肚白', '初熟杏黄', '山鸡黄', '莲子白', '蟹壳灰', '沙石黄', '甘草黄', '燕羽灰', '鹅掌黄', '麦芽糖黄', '浅驼色', '百灵鸟灰', '酪黄', '荔肉白', '淡肉色', '河豚灰', '蜴蜊绿', '汉白玉', '橙皮黄', '莱阳梨黄', '枇杷黄', '金叶黄', '苍黄', '粉白', '淡橘橙', '珍珠灰', '龟背黄', '浅灰', '铅灰', '中灰', '雄黄', '蜜黄', '风帆黄', '桂皮淡棕', '金莺黄', '肉色', '凋叶棕', '古铜绿', '落英淡粉', '软木黄', '瓜瓤粉', '榴萼黄', '玳瑁黄', '焦茶绿', '蟹壳绿', '山鸡褐', '猴毛灰', '鹿角棕', '淡松烟', '万寿菊黄', '蛋壳黄', '杏黄', '橄榄灰', '鹤灰', '玛瑙灰', '淡银灰', '瓦灰', '夜灰', '北瓜黄', '荷花白', '松鼠灰', '淡米粉', '深灰', '海鸥灰', '茶褐', '驼色', '银灰', '鹿皮褐', '槟榔综', '晓灰', '淡赭', '古铜褐', '麂棕', '醉瓜肉', '雁灰', '鲑鱼红', '橘橙', '金黄', '玫瑰粉', '美人焦橙', '米色', '蛛网灰', '淡咖啡', '海螺橙', '岩石棕', '芒果棕', '陶瓷红', '菠萝红', '余烬红', '金莲花橙', '火砖红', '初桃粉红', '铁棕', '介壳淡粉红', '蟹壳红', '金驼', '燕颔红', '淡可可棕', '晨曦红', '玉粉红', '野蔷薇红', '藕荷', '长石灰', '中红灰', '火泥棕', '绀红', '莓酱红', '丁香棕', '淡玫瑰灰', '瓜瓤红', '淡藏花红', '筍皮棕', '润红', '龙睛鱼红', '淡土黄', '珠母灰', '芙蓉红', '落霞红', '法螺红', '草珠红', '咖啡', '中灰驼', '椰壳棕', '蟹蝥红', '淡豆沙', '淡桃红', '淡铁灰', '石板灰', '淡栗棕', '银朱', '草莓红', '洋水仙红', '朱红', '榴花红', '柿红', '可可棕', '淡罂粟红', '大红', '柞叶棕', '蜻蜓红', '橡树棕', '颊红', '桃红', '火岩棕', '淡藤萝紫', '赭石', '铁水红', '胭脂红', '极光红', '红汞红', '萝卜红', '曲红', '谷鞘红', '苹果红', '桂红', '粉红', '暗驼棕', '夕阳红', '樱桃红', '珊瑚红', '火山棕', '栗棕', '鹤顶红', '舌红', '鹅血石红', '酱棕', '鱼鳃红', '芦穗灰', '丽春红', '覆盆子红', '海报灰', '豆沙', '榴子红', '秋海棠红', '无花果红', '淡绯', '玫瑰灰', '淡菽红', '枸枢红', '貂紫'];
      var color_index = Math.floor(Math.random()*colors.length);
      color_index = index;
      index = (index + 1)%526;
      var color = colors[color_index];
      var color_name = colors_name[color_index];
      var href = `https://dummyimage.com/${img_size}/${color}/ffffff`;
      var title = color_name;
      var caption = `<div class="jg-caption"><span style="color:#${color}">${title}</span></div>`;
      var img = `<a target="_blank" href="${href}"><img src="${href}" alt="${title}"/>${caption}</a>`;
      $('#0x1e8af9929').append(img);
      $('#0x1e8af9929').justifiedGallery('norewind');    
    }
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() +1 > $(document).height()) {
        for (var i = 0; i < 10; i++) {
          var random_param = words[Math.floor(Math.random()*words.length)]
          random_param = random_param + ',' + words[Math.floor(Math.random()*words.length)];
          random_param = random_param + ',' + words[Math.floor(Math.random()*words.length)];
          random_param = random_param + ',' + words[Math.floor(Math.random()*words.length)];
          var href = 'https://source.unsplash.com/random?' + random_param;
          var title = random_param;
          var caption = `<div class="jg-caption">Keywords:&ensp;<span style="color:#a61b29">${title}</span></div>`;
          var img = `<a target="_blank" href="${href}"><img src="${href}" alt="${title}"/>${caption}</a>`;
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
              var img = `<a><img src="${href}" /></a>`;
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
    cfg.api = "https://api.github.com/repos/shaoyaoqian/images-1/contents/必应壁纸/";
    cfg.cdn = "https://githubimages.pengfeima.cn/必应壁纸/";
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
    cfg.api = "https://api.github.com/repos/mfmpf/weibo-mpf/contents/output/picture?ref=output";
    cfg.cdn = "https://raw.githubusercontent.com/mfmpf/weibo-mpf/output/output/picture/";
    cfg.id  = "0xjd804kca3i";
    if (document.getElementById(cfg.id)) {
      InfiniteScrollGallery.layoutDiv(cfg);
    }
  });
});


// - <script defer="" src=""></script>
// - <link media="all" onload="media='all'" rel="stylesheet" href=>
// - <script defer="" src="https://fastly.jsdelivr.net/npm/shikwasa@2.1/dist/shikwasa.chapter.min.js"></script>
// - <link media="all" onload="media='all'" rel="stylesheet" href="https://fastly.jsdelivr.net/npm/shikwasa@2.1/dist/shikwasa.chapter.min.css">




if (document.getElementsByClassName('hero-player').length){
  stellar.loadCSS("https://fastly.jsdelivr.net/npm/shikwasa@2.2/dist/style.css");
  // stellar.loadCSS("https://fastly.jsdelivr.net/npm/shikwasa@2.1/dist/shikwasa.chapter.min.css")
  // stellar.loadScript("https://fastly.jsdelivr.net/npm/shikwasa@2.1/dist/shikwasa.chapter.min.js")
  stellar.jQuery(() => {
    stellar.loadScript("https://fastly.jsdelivr.net/npm/shikwasa@2.2/dist/shikwasa.min.js").then(()=>{
      const audio = {
        title: '喜欢',
        artist: '张悬',
        src: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/453927771.mp3',
        cover: 'https://raw.githubusercontent.com/shaoyaoqian/images-1/main/music/453927771.png',
        // chapters: [
        //   { title:'Chapter 1', startTime:0, endTime:10 }, // the first chapter
        //   { title:'Chapter 2', startTime:10, endTime:20 }, // the second chatper
        // ],
      }

      // Shikwasa.Player.use(shikwasa.Chapter)
      const player = new Shikwasa.Player({
        audio,
        themeColor: '#0f59a4',
        theme: 'dark',
        container: document.querySelector('.hero-player'),
        preload: 'metadata',
        fixed: {
          type: 'static',
        },
      })
    });
  });

}
