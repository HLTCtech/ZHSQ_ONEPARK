/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:22:58
 * @Description: file content
 */
import request from '@/utils/request'

// 查询所有的地上停车信息.
export function fetchListAll(query) {
  return request({
    url: '/onepark/pay/parking/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的车位信息.
export function fetchSearch(query) {
  return request({
    url: '/onepark/pay/parking/search',
    method: 'post',
    data: { query }
  })
}

// 缴费成功后的跳转逻辑，根据指定carLoc查询指定的住宅信息.
export function fetchSearchByCarLoc(carLoc) {
  return request({
    url: '/onepark/pay/parking/searchByCarLoc',
    method: 'post',
    data: { carLoc }
  })
}

// 向后台提交表单（新增车位信息）.
export function postNewCarInfo(newInfoFormPost) {
  return request({
    url: '/onepark/pay/parking/carInfoPost/new',
    method: 'post',
    data: { newInfoFormPost }
  })
}

// 向后台提交表单（变更车位信息）.
export function postChangeInfo(infoChangeFormPost) {
  return request({
    url: '/onepark/pay/parking/carInfoPost/change',
    method: 'post',
    data: { infoChangeFormPost }
  })
}

// 新增车位时当缴费方式为“特批”，调取sms.
export function getSMSCode(newInfoFormPost) {
  return request({
    url: '/onepark/pay/parking/getSMS',
    method: 'post',
    data: { newInfoFormPost }
  })
}

// 收费页面上方显示指定房间费用信息.
export function fetchParkingPreViewAll(houseId) {
  return request({
    url: '/onepark/pay/parking/pv/all',
    method: 'post',
    data: { houseId }
  })
}

// 指定费用开始时间周期.
export function postDaterangeStart(query) {
  return request({
    url: '/onepark/pay/parking/postDaterangeStart',
    method: 'post',
    data: { query }
  })
}
// 停车场维护费列表(无分页).
export function allNoPage(query) {
  return request({
    url: '/onepark/pay/parking/allNoPage',
    method: 'post',
    data: query
  })
}
// 停车场维护费搜索(无分页).
export function listsearch(query) {
  return request({
    url: '/onepark/pay/parking/listsearch',
    method: 'post',
    data: {query}
  })
}
