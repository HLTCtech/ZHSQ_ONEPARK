import request from '@/utils/request'

// 查询所有的住宅信息
export function fetchListAll(query) {
  return request({
    url: '/house/pay/electric/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的住宅信息
export function fetchSearch(query) {
  return request({
    url: '/house/pay/electric/search',
    method: 'get',
    params: { query }
  })
}

// 指定房号--所有的具体费用详情的弹出模态框
export function fetchPreViewAll(houseId) {
  return request({
    url: '/house/pay/electric/pv/all',
    method: 'get',
    params: { houseId }
  })
}

// 指定月份--具体费用详情的弹出模态框
export function fetchPreViewSingle(pv, houseId) {
  return request({
    url: '/house/pay/electric/pv/single',
    method: 'get',
    params: { pv, houseId }
  })
}

// 展示所有月份的电表读数及费用信息
export function fetchAllDetailByMonth(houseId) {
  return request({
    url: '/house/pay/electric/details',
    method: 'get',
    params: { houseId }
  })
}

// 向后台提交表单（费用收缴）
export function postMoney(formPost, houseId) {
  return request({
    url: '/house/pay/electric/moneyPost',
    method: 'get',
    params: { formPost, houseId }
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
