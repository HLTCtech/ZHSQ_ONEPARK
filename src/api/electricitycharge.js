import request from '@/utils/request'

// 电费欠费列表.
export function electricBlance(data) {
  return request({
    url: '/onepark/electricExport/electricBlance',
    method: 'post',
    data
  })
}
// 电费欠费列表(搜索).
export function getElectricBlance(data) {
  return request({
    url: '/onepark/electricExport/getElectricBlance',
    method: 'post',
    data
  })
}
