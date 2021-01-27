import request from '@/utils/request'

// 所有的页面点击houseId获取房屋信息变更历史
export function getLogByHouseId(houseId) {
  return request({
    url: '/onepark/operationLog/getLogByHouseId',
    method: 'post',
    data: { houseId }
  })
}

// 收费记录list
export function listMoneyGetLog(query) {
  return request({
    url: '/onepark/operationLog/moneyGet/list',
    method: 'post',
    data: { query }
  })
}

// 收费记录search
export function searchMoneyGetLog(query) {
  return request({
    url: '/onepark/operationLog/moneyGet/search',
    method: 'post',
    data: { query }
  })
}

// 退款记录list
export function listMoneyReturnLog(query) {
  return request({
    url: '/onepark/operationLog/moneyReturn/list',
    method: 'post',
    data: { query }
  })
}

// 退款记录search
export function searchMoneyReturnLog(query) {
  return request({
    url: '/onepark/operationLog/moneyReturn/search',
    method: 'post',
    data: { query }
  })
}

// 房屋信息变更list
export function listHouseChangeLog(query) {
  return request({
    url: '/onepark/operationLog/houseChange/list',
    method: 'post',
    data: { query }
  })
}

// 房屋信息变更search
export function searchHouseChangeLog(query) {
  return request({
    url: '/onepark/operationLog/houseChange/search',
    method: 'post',
    data: { query }
  })
}

// 车辆信息变更list
export function listParkingChangeLog(query) {
  return request({
    url: '/onepark/operationLog/parkingChange/list',
    method: 'post',
    data: { query }
  })
}

// 车辆信息变更search
export function searchParkingChangeLog(query) {
  return request({
    url: '/onepark/operationLog/parkingChange/search',
    method: 'post',
    data: { query }
  })
}


