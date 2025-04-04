import request from '@/utils/request'

// 查询所有的流水
export function fetchExportList() {
  return request({
    url: '/onepark/waterBillManage/all',
    method: 'get'
  })
}

// 查询流水信息
export function fetchExportSearch(query) {
  return request({
    url: '/onepark/waterBillManage/search',
    method: 'post',
    data: { query }
  })
}

