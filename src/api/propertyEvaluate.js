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

// 服务评价search
export function getServiceSuggestDetail(listQuery_search) {
  return request({
    url: '/property/serviceRate/serviceSuggestDetail',
    method: 'post',
    data: { listQuery_search }
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

// 管家评价search
export function getBulterSuggestDetail(listQuery_search) {
  return request({
    url: '/property/bulterRate/bulterSuggestDetail',
    method: 'post',
    data: { listQuery_search }
  })
}
