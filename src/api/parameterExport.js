/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:14:30
 * @Description: file content
 */
import request from '@/utils/request'

// 住宅物业费台账列表(无分页).
export function propertyAllNotPage(data) {
  return request({
    url: '/onepark/pay/property/house/allNotPage',
    method: 'post',
    data
  })
}
// 住宅物业费台账列表搜索(无分页).
export function propertyHouseSearch(data) {
  return request({
    url: '/onepark/pay/property/house/search',
    method: 'post',
    data
  })
}
// 房源信息变更列表(无分页).
export function houseChangeAllNotPage(data) {
  return request({
    url: '/onepark/info/houseChange/allNotPage',
    method: 'post',
    data
  })
}
// 房源信息变更列表搜索(无分页).
export function houseChangeSearchNotPage(data) {
  return request({
    url: '/onepark/info/houseChange/searchNoPage',
    method: 'post',
    data
  })
}