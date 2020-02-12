import request from '@/utils/request'

// 查询所有的物业收费流水信息
export function fetchPropertyWaterBillListAll(query) {
  return request({
    url: '/billOverall/propertyWaterBill/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的物业收费流水信息
export function fetchPropertyWaterBillSearch(query) {
  return request({
    url: '/billOverall/propertyWaterBill/search',
    method: 'get',
    params: { query }
  })
}

// 查询所有的装修保证金台账
export function fetchDecorationDepositListAll(query) {
  return request({
    url: '/billOverall/decorationDeposit/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的装修保证金台账
export function fetchDecorationDepositSearch(query) {
  return request({
    url: '/billOverall/decorationDeposit/search',
    method: 'get',
    params: { query }
  })
}

