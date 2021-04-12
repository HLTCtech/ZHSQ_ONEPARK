/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:25:08
 * @Description: file content
 */
import request from '@/utils/request'

// 所有记录的list.
export function fetchTrashLogList(listQuery_all) {
  return request({
    url: '/onepark/pay/trash/log/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索记录search.
export function fetchTrashLogSearch(listQuery_search) {
  return request({
    url: '/onepark/pay/trash/log/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 缴费成功后查询指定id的操作记录.
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/onepark/pay/trash/log/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 单一收费详情表单.
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/onepark/pay/trash/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 当缴费方式为“特批”，调取sms.
export function getTrashSMS(singleSMSPost) {
  return request({
    url: '/onepark/pay/trash/getSMS',
    method: 'post',
    data: { singleSMSPost }
  })
}

// 根据houseId返回业主姓名和应缴金额.
export function getHouseNameMoneyShallPay(houseId) {
  return request({
    url: '/onepark/pay/trash/getHouseNameMoneyShallPay',
    method: 'post',
    data: { houseId }
  })
}

