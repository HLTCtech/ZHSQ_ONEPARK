import request from '@/utils/request'

// 向后台提交表单（费用收缴）
export function postMoney(formPost) {
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

// 住宅接口-----------------------------------------------------------
// 查询所有的住宅装修保证金信息
export function fetchShopDecorationDepositListAll(query) {
  return request({
    url: '/pay/decorationDeposit/shop/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的物业收费流水信息
export function fetchShopDecorationDepositSearch(query) {
  return request({
    url: '/pay/decorationDeposit/shop/search',
    method: 'get',
    params: { query }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/pay/decorationDeposit/getSMS',
    method: 'post',
    params: { formPost }
  })
}

// 退款
export function returnMoney(formReturn) {
  return request({
    url: '/pay/decorationDeposit/moneyReturn',
    method: 'post',
    params: { formReturn }
  })
}
