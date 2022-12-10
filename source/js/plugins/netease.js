
// 网易云音乐
// 要确保引入了https://unpkg.com/flyio/dist/umd/fly.umd.min.js文件
console.log("netease-music-player");
var fly=new Fly();
url_base = "https://netease.pengfeima.cn"

const NeteaseMusicAPI = {
  download_lyric: async(id) => {
    console.log('Downloading lyric...', id)    
    url = url_base + "/lyric"
    params = {
        'id':id
    }
    // 成功的回调函数
    function download_lyric_success(result) {
      console.log("Downloaded successfully.");
      return result;
    }
    
    // 失败的回调函数
    function download_lyric_fail(error) {
      console.log("Failed to download." + error);
    }
    
    let result = fly.request(url, params).then(download_lyric_success,download_lyric_fail);
    let data = await result.then((result) => {return result['data']['lrc']['lyric']});
    return data;
  },
  download_song_detail: async(id) => {
    url = url_base + "/song/detail"
    params = {
        'ids':id
    }

    let result = fly.request(url, params).then(
      (result) => {
        console.log("Downloaded successfully.");
        console.log(result['data']['songs'][0]['name']);
        console.log(result['data']['songs'][0]['ar'][0]['name']);
        console.log(result['data']['songs'][0]['al']['picUrl']);
        return result;
      },
      (error) => {
        console.log("Failed to download. The error is : " + error);
        return result;
      });
    return result;
  },
  download_song_url: (id, level = 'standard') => {
    url = url_base + "/song/url/v1"
    params = {
        'id'    : id,
        'level' : level
    }

    let result = fly.request(url, params).then(
      (result) => {
        console.log("Downloaded successfully.");
        url = result['data']['data'][0]['url'];
        // 删除 https:// 或者 http://
        url = url.replace(/^(http|https):/, '');
        console.log(url);
        return url;
      },
      (error) => {
        console.log("Failed to download. The error is : " + error);
        return result;
      });
    return result;
  },
  layoutDiv: (cfg) => {
    const el = $(cfg.el)[0];
    var id = cfg.song_id;
    var b = NeteaseMusicAPI.download_lyric(id);
    var c = NeteaseMusicAPI.download_song_detail(id);
    var url = NeteaseMusicAPI.download_song_url(id);
    url.then((song_url)=>{
      var cell = '<audio src=\"' + song_url + '\" controls></audio>'
      $(el).append(cell);
    })    
  },
}




// <div class='netease-music-player' song_id='436147423'>
$(function () {
  const els = document.getElementsByClassName('netease-music-player');
  console.log("netease-music-player");
  console.log("els.length",els.length);

  for (var i = 0; i < els.length; i++) {
  console.log("netease-music-player");
  const el = els[i];
    const song_id = el.getAttribute('song_id');
    if (song_id == null) {
      continue;
    }
    var cfg = new Object();
    cfg.el = el;
    cfg.song_id = song_id;
    console.log("els.length",song_id);
    NeteaseMusicAPI.layoutDiv(cfg);
  }
});
