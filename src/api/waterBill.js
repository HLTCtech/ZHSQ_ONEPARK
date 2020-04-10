import request from '@/utils/request'

// 查询所有的流水
export function fetchExportList() {
  return request({
    url: '/waterBill/all',
    method: 'get'
  })
}

// 查询流水信息
export function fetchExportSearch(query) {
  return request({
    url: '/waterBill/search',
    method: 'get',
    params: { query }
  })
}

