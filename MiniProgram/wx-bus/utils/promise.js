// function wxPromisify(fn) {
//   return function(obj={}){
//     return new Promise((resolve,reject)=>{
//       obj.success=function(res){
//         resolve(res);
//       };
//       obj.fail=function(res){
//         reject(res);
//       }
//       fn(obj);
//     });
//   }
// }

// module.exports={
//   wxPromisify
// };

module.exports = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  }
}