import request from '@/utils/request'

// 查询所有的流水
export function fetchExportList(query) {
  return request({
    url: '/waterBill/all',
    method: 'get',
    params: { query }
  })
}

// 查询流失信息
export function fetchExportSearch(query) {
  return request({
    url: '/waterBill/search',
    method: 'get',
    params: { query }
  })
}

