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

// 向后台提交表单（费用收缴）
export function postMoney(formPost, houseId) {
  return request({
    url: '/pay/decorationDeposit/moneypost',
    method: 'post',
    params: { formPost }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/decorationDeposit/searchById',
    method: 'get',
    params: { houseId }
  })
}
