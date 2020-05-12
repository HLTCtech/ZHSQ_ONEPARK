import request from '@/utils/request'

// 查询当前登录的操作人所有的收费记录(可打印)
export function fetchAllCharging(listQuery) {
  return request({
    url: '/chargingVoucher/allByAdminId',
    method: 'post',
    data: { listQuery }
  })
}

// 查询当前登录的操作人所有的收费记录(已打印)
export function fetchAllPrinted(listQuery) {
  return request({
    url: '/chargingVoucher/allPrintedByAdminId',
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

// 申请重新打印获取验证码
export function getReprintSMS(reprintForm) {
  return request({
    url: '/chargingVoucher/getReprintSMS',
    method: 'post',
    data: { reprintForm }
  })
}

// 提交重新打印表单
export function receiptReprintPost(reprintForm) {
  return request({
    url: '/chargingVoucher/receiptReprintPost',
    method: 'post',
    data: { reprintForm }
  })
}

// 指定收据号表单提交
export function assignReceiptPost(assignReceiptNumQuery) {
  return request({
    url: '/chargingVoucher/assignReceiptNum',
    method: 'post',
    data: { assignReceiptNumQuery }
  })
}
