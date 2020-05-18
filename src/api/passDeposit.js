import request from '@/utils/request'

// 向后台提交表单（费用收缴）
export function postMoney(formPost) {
  return request({
    url: '/pay/passDeposit/moneypost',
    method: 'post',
    data: { formPost }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/passDeposit/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 住宅接口-----------------------------------------------------------
// list
export function fetchPassDepositListAll(query) {
  return request({
    url: '/pay/passDeposit/house/all',
    method: 'post',
    data: query
  })
}

// 搜索
export function fetchPassDepositSearch(query) {
  return request({
    url: '/pay/passDeposit/house/search',
    method: 'post',
    data: { query }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/pay/passDeposit/getSMS',
    method: 'post',
    data: { formPost }
  })
}

// 退款
export function returnMoney(formReturn) {
  return request({
    url: '/pay/passDeposit/moneyReturn',
    method: 'post',
    data: { formReturn }
  })
}

// 申请退款
export function applyReturnMoney(applyMoneyReturn) {
  return request({
    url: '/pay/passDeposit/applyMoneyReturn',
    method: 'post',
    data: { applyMoneyReturn }
  })
}

// 审核通过
export function verifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/pay/passDeposit/verifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 驳回申请
export function refuseVerifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/pay/passDeposit/refuseVerifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}
