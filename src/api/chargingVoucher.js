import request from '@/utils/request'

// 查询当前登录的操作人所有的收费记录
export function fetchAllCharging(listQuery) {
  return request({
    url: '/chargingVoucher/allByAdminId',
    method: 'post',
    data: { listQuery }
  })
}

// 根据房号和当前操作人id查询所有的缴费记录
export function getVoucherByHouseId(query) {
  return request({
    url: '/chargingVoucher/getVoucherByHouseId',
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

