import request from '@/utils/request'

// 查询所有科目编码
export function fetchExportList() {
  return request({
    url: '/subjectCode/all',
    method: 'get'
  })
}

// 查询科目编码
export function fetchExportSearch(query) {
  return request({
    url: '/subjectCode/search',
    method: 'get',
    params: { query }
  })
}

