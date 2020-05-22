import request from '@/utils/request'

// 向后台提交表单（费用收缴）
export function postMoney(formPost) {
  return request({
    url: '/onepark/pay/decorationDeposit/moneypost',
    method: 'post',
    data: { formPost }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/onepark/pay/decorationDeposit/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 住宅接口-----------------------------------------------------------
// 查询所有的住宅装修保证金信息
export function fetchHouseDecorationDepositListAll(query) {
  return request({
    url: '/onepark/pay/decorationDeposit/house/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的物业收费流水信息
export function fetchHouseDecorationDepositSearch(query) {
  return request({
    url: '/onepark/pay/decorationDeposit/house/search',
    method: 'post',
    data: { query }
  })
}

// 商铺接口-----------------------------------------------------------
// 查询所有的商铺装修保证金信息
export function fetchShopDecorationDepositListAll(query) {
  return request({
    url: '/onepark/pay/decorationDeposit/shop/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的物业收费流水信息
export function fetchShopDecorationDepositSearch(query) {
  return request({
    url: '/onepark/pay/decorationDeposit/shop/search',
    method: 'post',
    data: { query }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/onepark/pay/decorationDeposit/getSMS',
    method: 'post',
    data: { formPost }
  })
}

// 退款
export function returnMoney(formReturn) {
  return request({
    url: '/onepark/pay/decorationDeposit/moneyReturn',
    method: 'post',
    data: { formReturn }
  })
}

// 申请退款
export function applyReturnMoney(applyMoneyReturn) {
  return request({
    url: '/onepark/pay/decorationDeposit/applyMoneyReturn',
    method: 'post',
    data: { applyMoneyReturn }
  })
}

// 审核通过
export function verifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/decorationDeposit/verifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 驳回申请
export function refuseVerifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/decorationDeposit/refuseVerifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 驳回申请
export function getHouseNameMoneyShallPay(houseId) {
  return request({
    url: '/onepark/pay/decorationDeposit/getHouseNameMoneyShallPay',
    method: 'post',
    data: { houseId }
  })
}

