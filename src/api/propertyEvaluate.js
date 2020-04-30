import request from '@/utils/request'

// 服务评价list
export function serviceRateList(listQuery_all) {
  return request({
    url: '/property/serviceRate/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 服务评价search
export function serviceRateSearch(listQuery_search) {
  return request({
    url: '/property/serviceRate/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 服务评价获取建议内容
export function getServiceSuggestDetail(houseId, suggestTime) {
  return request({
    url: '/property/serviceRate/serviceSuggestDetail',
    method: 'post',
    data: { houseId, suggestTime }
  })
}

// 管家评价list
export function bulterRateList(listQuery_all) {
  return request({
    url: '/property/bulterRate/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 管家评价search
export function bulterRateSearch(listQuery_search) {
  return request({
    url: '/property/bulterRate/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 管家评价获取建议内容
export function getBulterSuggestDetail(houseId, suggestTime) {
  return request({
    url: '/property/bulterRate/bulterSuggestDetail',
    method: 'post',
    data: { houseId, suggestTime }
  })
}

// 报修评价list
export function repairRateList(listQuery_all) {
  return request({
    url: '/property/repairRate/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 报修评价search
export function repairRateSearch(listQuery_search) {
  return request({
    url: '/property/repairRate/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 报修评价获取建议内容
export function getRepairSuggestDetail(houseId, suggestTime) {
  return request({
    url: '/property/repairRate/repairSuggestDetail',
    method: 'post',
    data: { houseId, suggestTime }
  })
}
