import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/onepark/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function electricStatisticsAll(query) {
  return request({
    url: '/onepark/electricStatistics/all',
    method: 'post',
    data: query
  })
}
