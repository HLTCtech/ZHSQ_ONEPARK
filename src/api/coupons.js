/*
 * @Author: 周鹏飞
 * @Date: 2021-04-01 17:25:54
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 15:46:05
 * @Description: file content
 */
/*
 * @Author: 周鹏飞
 * @Date: 2021-03-31 15:19:51
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-01 17:02:58
 * @Description: file content
 */
// 获取优惠券列表.
import request from '@/utils/request'
import qs from "qs"
export function coupons(query) {
  return request({
    url: '/oneCoupons/couponList',
    method: 'post',
    params: query
  })
}
// 获取优惠券使用记录.
export function couponsRecord(query) {
  return request({
    url: '/oneCoupons/couponRecordList',
    method: 'post',
    params: query
  })
}
// 添加优惠券.
export function addCoupons(query) {
  return request({
    url: '/oneCoupons/addCoupon',
    method: 'post',
    params: query
  })
}
// 修改优惠券.
export function editCoupons(query) {
  return request({
    url: '/oneCoupons/editCoupon',
    method: 'post',
    params: query
  })
}
// 删除优惠券的接口.
export function delCoupon(query) {
  return request({
    url: '/oneCoupons/delCoupon',
    method: 'post',
    params: query
  })
}
