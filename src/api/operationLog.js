import request from '@/utils/request'

// 所有的页面点击houseId获取房屋信息变更历史
export function getLogByHouseId(houseId) {
  return request({
    url: '/operationLog/getLogByHouseId',
    method: 'get',
    params: { houseId }
  })
}

// 收费记录list
export function listMoneyGetLog(query) {
  return request({
    url: '/operationLog/moneyGet/list',
    method: 'get',
    params: { query }
  })
}

// 收费记录search
export function searchMoneyGetLog(query) {
  return request({
    url: '/operationLog/moneyGet/search',
    method: 'get',
    params: { query }
  })
}

// 退款记录list
export function listMoneyReturnLog(query) {
  return request({
    url: '/operationLog/moneyReturn/list',
    method: 'get',
    params: { query }
  })
}

// 退款记录search
export function searchMoneyReturnLog(query) {
  return request({
    url: '/operationLog/moneyReturn/search',
    method: 'get',
    params: { query }
  })
}

// 房屋信息变更list
export function listHouseChangeLog(query) {
  return request({
    url: '/operationLog/houseChange/list',
    method: 'get',
    params: { query }
  })
}

// 房屋信息变更search
export function searchHouseChangeLog(query) {
  return request({
    url: '/operationLog/houseChange/search',
    method: 'get',
    params: { query }
  })
}

// 车辆信息变更list
export function listParkingChangeLog(query) {
  return request({
    url: '/operationLog/parkingChange/list',
    method: 'get',
    params: { query }
  })
}

// 车辆信息变更search
export function searchParkingChangeLog(query) {
  return request({
    url: '/operationLog/parkingChange/search',
    method: 'get',
    params: { query }
  })
}
