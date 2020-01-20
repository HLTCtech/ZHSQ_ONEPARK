import request from '@/utils/request'

// 通过id（房间号）来查找具体信息
export function fetchList(query) {
  return request({
    url: '/house/list',
    method: 'get',
    params: query
  })
}

// 下面为article.js中代码，暂未针对具体业务进行修改
export function fetchArticle(id) {
  return request({
    url: '/house/detail',
    method: 'get',
    params: { id }
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/article/update',
//     method: 'post',
//     data
//   })
// }
