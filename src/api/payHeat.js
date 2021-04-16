import request from '@/utils/request'

// 所有记录的list
export function fetchHeatLogList(listQuery_all) {
  return request({
    url: '/onepark/pay/heat/log/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索记录search
export function fetchHeatLogSearch(listQuery_search) {
  return request({
    url: '/onepark/pay/heat/log/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/onepark/pay/heat/log/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/onepark/pay/heat/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 复合收费详情表单
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/onepark/pay/heat/mixMoneyPost',
    method: 'post',
    data: { mixFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getHeatSMS(singleSMSPost) {
  return request({
    url: '/onepark/pay/heat/getSMS',
    method: 'post',
    data: { singleSMSPost }
  })
}

// 退款
export function returnMoney(formReturn) {
  return request({
    url: '/onepark/pay/heat/moneyReturn',
    method: 'post',
    data: { formReturn }
  })
}

// 申请退款
export function applyReturnMoney(applyMoneyReturn) {
  return request({
    url: '/onepark/pay/heat/applyMoneyReturn',
    method: 'post',
    data: { applyMoneyReturn }
  })
}

// 审核通过
export function verifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/heat/verifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 驳回申请
export function refuseVerifyReturnMoney(verifyMoneyReturn) {
  return request({
    url: '/onepark/pay/heat/refuseVerifyMoneyReturn',
    method: 'post',
    data: { verifyMoneyReturn }
  })
}

// 根据houseId返回业主姓名和应缴金额
export function getHouseNameMoneyShallPay(houseId) {
  return request({
    url: '/onepark/pay/heat/getHouseNameMoneyShallPay',
    method: 'post',
    data: { houseId }
  })
}
