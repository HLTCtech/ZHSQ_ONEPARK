import request from '@/utils/request'

// 向后台提交表单（费用收缴）
export function postMoney(formPost) {
  return request({
    url: '/onepark/pay/LightWellDeposit/moneypost',
    method: 'post',
    data: { formPost }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/onepark/pay/LightWellDeposit/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 住宅接口-----------------------------------------------------------
// 查询所有的采光井施工保证金信息
export function fetchLightWellDepositListAll(query) {
  return request({
    url: '/onepark/pay/LightWellDeposit/house/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的采光井施工保证金
export function fetchLightWellDepositSearch(query) {
  return request({
    url: '/onepark/pay/LightWellDeposit/house/search',
    method: 'post',
    data: { query }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/onepark/pay/LightWellDeposit/getSMS',
    method: 'post',
    data: { formPost }
  })
}

// 退款
export function returnMoney(formReturn) {
  return request({
    url: '/onepark/pay/LightWellDeposit/moneyReturn',
    method: 'post',
    data: { formReturn }
  })
}

// 申请退款
export function applyReturnMoney(applyMoneyReturn) {
  return request({
    url: '/onepark/pay/LightWellDeposit/applyMoneyReturn',
    method: 'post',
    data: { applyMoneyReturn }
  })
}

// 审核通过
export function verifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/LightWellDeposit/verifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 驳回申请
export function refuseVerifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/LightWellDeposit/refuseVerifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 获取应缴金额
export function getHouseNameMoneyShallPay(houseId) {
  return request({
    url: '/onepark/pay/LightWellDeposit/getHouseNameMoneyShallPay',
    method: 'post',
    data: { houseId }
  })
}

