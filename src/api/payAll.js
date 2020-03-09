import request from '@/utils/request'

// 搜索指定房间的所有费用信息
export function fetchBillInfoSearch(listQuery) {
  return request({
    url: '/pay/bill/infoSearch',
    method: 'get',
    params: { listQuery }
  })
}

// 获取所有的应缴费用账单
export function fetchBillAllList(listQuery) {
  return request({
    url: '/pay/bill/all',
    method: 'get',
    params: { listQuery }
  })
}

// 收缴费用提交
export function moneyPostAll(moneyAllPost) {
  return request({
    url: '/pay/bill/moneyPostAll',
    method: 'post',
    params: { moneyAllPost }
  })
}

