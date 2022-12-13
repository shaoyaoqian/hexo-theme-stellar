// // 找到 tile-api 类的div。
// // 处理内部的img标签。



// // (function(){
// //     var  grid = new Minigrid({
// //         container: '.tile-wrapper',
// //         item: '.tile-photo',
// //         gutter: 6
// //       });
// //     grid.mount();
// //     console.log('')
    
// //     // mount
// //     function update() {
// //       grid.mount();
// //     console.log('update')
// //   }
  
// //     document.addEventListener('DOMContentLoaded', init);
// //     window.addEventListener('resize', update);
// //   })();




// (function(){

//   const standard_width = 200;

//   const els = document.getElementsByClassName('cards');

//   var grid = [];

//   for (var j=0; j<els.length; j++){

//     var el = els[j];
//     var id = el.getAttribute('id');

//     var elsels = el.getElementsByClassName('card');
//     for (var i = 0; i < elsels.length; i++) {
//       const elel = elsels[i];
//       // 默认设置为正方形
//       elel.setAttribute("style", "width: " + standard_width.toString() + "px;height:" + standard_width.toString() + "px;");
//       // // 根据原图长宽比设置高度
//       // const img = elel.getElementsByTagName('img')[0];
//       // var img_size = new Promise((resolve, reject) => {
//       //   // 图片加载完之后才能获取宽高
//       //   img.onload = () => {
//       //       resolve({width:img.naturalWidth,height: img.naturalHeight});
//       //   };
//       // });
//       // img_size.then((width, height)=>{
//       //   console.log(width, height);
//       //   var standard_height = standard_width*height/width;
//       //   elel.setAttribute("style", "width: " + standard_width.toString() + "px;height:" + standard_height.toString() + "px;");
//       //   console.log(elel);
//       // })
//     }

//     grid.push(new Minigrid({
//         container: "#" + id,
//         item: '.card',
//         gutter: 6
//       }));

//   }

//   // mount
//   function update() {
//     for(var i=0; i<grid.length; i++){
//       grid[i].mount();
//     }
//     console.log('update')
//   }

//   for(var i=0; i<grid.length; i++){
//     grid[i].mount();
    
//     window.addEventListener('resize', update);
//   }
// })();
  