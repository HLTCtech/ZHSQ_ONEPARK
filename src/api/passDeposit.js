import request from '@/utils/request'

// 向后台提交表单（费用收缴）
export function postMoney(formPost) {
  return request({
    url: '/onepark/pay/passDeposit/moneypost',
    method: 'post',
    data: { formPost }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/onepark/pay/passDeposit/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 住宅接口-----------------------------------------------------------
// list
export function fetchPassDepositListAll(query) {
  return request({
    url: '/onepark/pay/passDeposit/house/all',
    method: 'post',
    data: query
  })
}

// 搜索
export function fetchPassDepositSearch(query) {
  return request({
    url: '/onepark/pay/passDeposit/house/search',
    method: 'post',
    data: { query }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/onepark/pay/passDeposit/getSMS',
    method: 'post',
    data: { formPost }
  })
}

// 退款
export function returnMoney(formReturn) {
  return request({
    url: '/onepark/pay/passDeposit/moneyReturn',
    method: 'post',
    data: { formReturn }
  })
}

// 申请退款
export function applyReturnMoney(applyMoneyReturn) {
  return request({
    url: '/onepark/pay/passDeposit/applyMoneyReturn',
    method: 'post',
    data: { applyMoneyReturn }
  })
}

// 审核通过
export function verifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/passDeposit/verifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 驳回申请
export function refuseVerifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/passDeposit/refuseVerifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 根据houseId返回业主姓名和应缴金额
export function getHouseNameMoneyShallPay(houseId) {
  return request({
    url: '/onepark/pay/passDeposit/getHouseNameMoneyShallPay',
    method: 'post',
    data: { houseId }
  })
}
// 出入证押金列表(无分页)
export function allNoPage(query) {
  return request({
    url: '/onepark/pay/passDeposit/house/allNoPage',
    method: 'post',
    data: query
  })
}
// 出入证押金搜索(无分页)
export function searchNoPage(query) {
  return request({
    url: '/onepark/pay/passDeposit/house/searchNoPage',
    method: 'post',
    data: { query }
  })
}
