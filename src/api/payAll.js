/*
 * @Author: 贺永胜
 * @email: 1378431028@qq.com
 * @Date: 2021-03-25 16:27:08
 * @LastEditors: 贺永胜
 * @LastEditTime: 2021-03-31 11:41:27
 * @Description: file content
 */
import request from '@/utils/request'

// 搜索指定房间的所有费用信息
export function fetchBillInfoSearch(listQuery) {
  return request({
    url: '/onepark/pay/bill/infoSearch',
    method: 'post',
    data: { listQuery }
  })
}

// 获取所有的应缴费用账单
export function fetchBillAllList(listQuery) {
  return request({
    url: '/onepark/pay/bill/all',
    method: 'post',
    data: { listQuery }
  })
}

// 根据房号查询优惠券

export function getCoupons(houseId) {
  return request({
    url: '/onepark/pay/bill/getCoupons',
    method: 'get',
    params: { houseId }
  })
}

// 清缴提交
export function moneyCleanPostAll(moneyAllPost) {
  return request({
    url: '/onepark/pay/bill/moneyCleanPostAll',
    method: 'post',
    data: { moneyAllPost }
  })
}

// 收缴提交
export function moneyPayPostAll(moneyAllPost) {
  return request({
    url: '/onepark/pay/bill/moneyPayPostAll',
    method: 'post',
    data: { moneyAllPost }
  })
}

// 监听前端物业费周期并返回对应金额
export function getRealtimeProperty(query) {
  return request({
    url: '/onepark/pay/bill/getRealtimeProperty',
    method: 'post',
    data: { query }
  })
}

// 监听前端停车管理费周期并返回对应金额
export function getRealtimeParking(parkingDateRange) {
  return request({
    url: '/onepark/pay/bill/getRealtimeParking',
    method: 'post',
    data: { parkingDateRange }
  })
}

// 监听前端电费周期并返回对应金额
export function getRealtimeElectric(electricDateRange) {
  return request({
    url: '/onepark/pay/bill/getRealtimeElectric',
    method: 'post',
    data: { electricDateRange }
  })
}
// 一键收费特批获取验证码
export function getSMS(data) {
  return request({
    url: '/onepark/pay/bill/moneyPayPostAll/getSMS',
    method: 'post',
    data
  })
}
