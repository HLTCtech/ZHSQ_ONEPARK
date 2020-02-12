import request from '@/utils/request'

// 住宅接口-----------------------------------------------------------
// 查询所有的住宅装修保证金信息
export function fetchHouseDecorationDepositListAll(query) {
  return request({
    url: '/pay/decorationDeposit/house/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的物业收费流水信息
export function fetchHouseDecorationDepositSearch(query) {
  return request({
    url: '/pay/decorationDeposit/house/search',
    method: 'get',
    params: { query }
  })
}
