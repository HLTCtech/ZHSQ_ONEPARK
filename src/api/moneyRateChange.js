import request from '@/utils/request'

// 所有记录的list.
export function fetchMoneyRateList(listQuery_all) {
  return request({
    url: '/onepark/moneyRateChange/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 所有记录的search.
export function fetchMoneyRateSearch(listQuery_search) {
  return request({
    url: '/onepark/moneyRateChange/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 指定房间费率变更表单.
export function rateChangePost(rateChangeForm) {
  return request({
    url: '/onepark/moneyRateChange/rateChangePost',
    method: 'post',
    data: { rateChangeForm }
  })
}

// 洋房费率变更表单.
export function foreignRateChangePost(foreignRateChangeForm) {
  return request({
    url: '/onepark/moneyRateChange/rateChangePost/foreign',
    method: 'post',
    data: { foreignRateChangeForm }
  })
}

// 合院费率变更表单.
export function quintaRateChangePost(quintaRateChangeForm) {
  return request({
    url: '/onepark/moneyRateChange/rateChangePost/quinta',
    method: 'post',
    data: { quintaRateChangeForm }
  })
}

