/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:28:08
 * @Description: file content
 */
import request from '@/utils/request'

// 所有租金的list.
export function fetchShopRentList(listQuery_all) {
  return request({
    url: '/onepark/pay/shopRent/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索租金search.
export function fetchShopRentSearch(listQuery_search) {
  return request({
    url: '/onepark/pay/shopRent/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 根据shopId查询应收费用信息.
export function getRentShallPay(shopId) {
  return request({
    url: '/onepark/pay/shopRent/rentShallPayByShopId',
    method: 'post',
    data: { shopId }
  })
}

// 当缴费方式为“特批”，调取sms.
export function getSMS(formPost) {
  return request({
    url: '/onepark/pay/shopRent/getSMS',
    method: 'post',
    data: { formPost }
  })
}

// 单一收费详情表单.
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/onepark/pay/shopRent/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 复合收费详情表单.
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/onepark/pay/shopRent/mixMoneyPost',
    method: 'post',
    data: { mixFormPost }
  })
}

// TEST----------所有租金的list.
export function fetchShopRentListTest(listQuery_all) {
  return request({
    url: '/onepark/pay/shopRent/allTest',
    method: 'post',
    data: { listQuery_all }
  })
}

// TEST----------搜索租金search.
export function fetchShopRentSearchTest(listQuery_search) {
  return request({
    url: '/onepark/pay/shopRent/searchTest',
    method: 'post',
    data: { listQuery_search }
  })
}
