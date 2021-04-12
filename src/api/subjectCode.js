import request from '@/utils/request'

// 查询所有科目编码.
export function fetchExportList(query) {
  return request({
    url: '/onepark/subjectCode/all',
    method: 'post',
    data: { query }
  })
}

// 查询科目编码.
export function fetchExportSearch(query) {
  return request({
    url: '/onepark/subjectCode/search',
    method: 'post',
    data: { query }
  })
}

