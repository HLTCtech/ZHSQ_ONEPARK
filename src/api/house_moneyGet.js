import request from '@/utils/request'

// 查询所有的住宅信息
export function housePay_fetchListAll(query) {
  return request({
    url: '/house/pay/electric/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的住宅信息
export function housePay_fetchSearch(query) {
  return request({
    url: '/house/pay/electric/search',
    method: 'get',
    params: { query }
  })
}

// 指定房号--所有的具体费用详情的弹出模态框
export function housePay_fetchPreView_all(houseId) {
  return request({
    url: '/house/pay/electric/pv/all',
    method: 'get',
    params: { houseId }
  })
}

// 指定月份--具体费用详情的弹出模态框
export function housePay_fetchPreView_single(pv, houseId) {
  return request({
    url: '/house/pay/electric/pv/single',
    method: 'get',
    params: { pv, houseId }
  })
}

// 下面为article.js中代码，暂未针对具体业务进行修改
// export function fetchArticle(id) {
//   return request({
//     url: '/house/detail',
//     method: 'get',
//     params: { id }
//   })
// }

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
