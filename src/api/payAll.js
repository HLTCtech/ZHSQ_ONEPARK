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

// 监听前端物业费周期并返回对应金额
export function getRealtimeProperty(propertyDateRange) {
  return request({
    url: '/pay/bill/getRealtimeProperty',
    method: 'post',
    data: { propertyDateRange }
  })
}

// 监听前端停车管理费周期并返回对应金额
export function getRealtimeParking(parkingDateRange) {
  return request({
    url: '/pay/bill/getRealtimeParking',
    method: 'post',
    data: { parkingDateRange }
  })
}

// 监听前端电费周期并返回对应金额
export function getRealtimeElectric(electricDateRange) {
  return request({
    url: '/pay/bill/getRealtimeElectric',
    method: 'post',
    data: { electricDateRange }
  })
}

