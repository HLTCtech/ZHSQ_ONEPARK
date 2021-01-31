import request from '@/utils/request'

// 电费导出列表
export function electricExportSearchall(data) {
  return request({
    url: '/onepark/electricExport/searchall',
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
// 电费月度统计按月份搜索
export function getWatchElectricByMonth(data) {
  return request({
    url: '/onepark/electricExport/getWatchElectricByMonth',
    method: 'post',
    data
  })
}
