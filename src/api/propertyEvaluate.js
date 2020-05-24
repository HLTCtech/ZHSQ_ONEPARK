import request from '@/utils/request'

// 服务评价list
export function serviceRateList(listQuery_all) {
  return request({
    url: '/onepark/property/serviceRate/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 服务评价search
export function serviceRateSearch(listQuery_search) {
  return request({
    url: '/onepark/property/serviceRate/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 服务评价获取建议内容
export function getServiceSuggestDetail(id) {
  return request({
    url: '/onepark/property/serviceRate/serviceSuggestDetail',
    method: 'post',
    data: { id }
  })
}

// 管家评价list
export function bulterRateList(listQuery_all) {
  return request({
    url: '/onepark/property/bulterRate/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 管家评价search
export function bulterRateSearch(listQuery_search) {
  return request({
    url: '/onepark/property/bulterRate/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 管家评价获取建议内容
export function getBulterSuggestDetail(id) {
  return request({
    url: '/onepark/property/bulterRate/bulterSuggestDetail',
    method: 'post',
    data: { id }
  })
}

// 报修评价list
export function repairRateList(listQuery_all) {
  return request({
    url: '/onepark/property/repairRate/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 报修评价search
export function repairRateSearch(listQuery_search) {
  return request({
    url: '/onepark/property/repairRate/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 报修评价获取建议内容
export function getRepairSuggestDetail(id) {
  return request({
    url: '/onepark/property/repairRate/repairSuggestDetail',
    method: 'post',
    data: { id }
  })
}
