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
    url: '/property/billRemind/search',
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

