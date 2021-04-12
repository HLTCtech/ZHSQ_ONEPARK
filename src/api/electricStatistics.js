/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 15:46:28
 * @Description: file content
 */
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
