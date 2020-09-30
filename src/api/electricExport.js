import request from '@/utils/request'

// 电费导出列表
export function electricExportAll(data) {
  return request({
    url: '/onepark/electricExport/all',
    method: 'post',
    data
  })
}
// 开始抄表
export function electricExportStartMeter(data) {
  return request({
    url: '/onepark/electricExport/startMeter',
    method: 'post',
    data
  })
}
