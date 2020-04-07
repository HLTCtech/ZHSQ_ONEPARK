import request from '@/utils/request'

// 查询当前登录的操作人所有的收费记录
export function fetchAllCharging(listQuery) {
  return request({
    url: '/chargingVoucher/allByAdminId',
    method: 'get',
    params: { listQuery }
  })
}

// 查询当前登录的操作人所有的收费记录
export function getMoneyDetailsByHouseId(query) {
  return request({
    url: '/chargingVoucher/getPaidDetialsByHouseId',
    method: 'get',
    params: { query }
  })
}

// 多项目打印后提交项目id
export function complexVoucherIdPost(query) {
  return request({
    url: '/chargingVoucher/complexPrintVoucherIds',
    method: 'post',
    data: { query }
  })
}

// 单一项目打印后提交项目id
export function singleVoucherIdPost(voucherId) {
  return request({
    url: '/chargingVoucher/singlePrintVoucherIds',
    method: 'post',
    data: { voucherId }
  })
}

