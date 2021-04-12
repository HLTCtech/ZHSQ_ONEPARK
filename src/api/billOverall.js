/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 15:45:38
 * @Description: file content
 */
import request from '@/utils/request'

// 查询所有的物业收费流水信息.
export function fetchPropertyWaterBillListAll(query) {
  return request({
    url: '/onepark/billOverall/propertyWaterBill/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的物业收费流水信息.
export function fetchPropertyWaterBillSearch(query) {
  return request({
    url: '/onepark/billOverall/propertyWaterBill/search',
    method: 'post',
    data: { query }
  })
}

// 查询所有的装修保证金台账.
export function fetchDecorationDepositListAll(query) {
  return request({
    url: '/onepark/billOverall/decorationDeposit/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的装修保证金台账.
export function fetchDecorationDepositSearch(query) {
  return request({
    url: '/onepark/billOverall/decorationDeposit/search',
    method: 'post',
    data: { query }
  })
}

// 查询费用累计信息.
export function fetchBillList(query) {
  return request({
    url: '/onepark/billOverall/billAddUp/dashboard/all',
    method: 'post',
    data: { query }
  })
}

// 获取当月应收数额（dashboard---panel）.
export function getEchartMoneyAllMonthly() {
  return request({
    url: '/onepark/billOverall/echart/dashboard/moneyGetMonthly',
    method: 'get'
  })
}

// 每月费用具体情况（dashboard---line）.
export function getEchartMoneyMonthly() {
  return request({
    url: '/onepark/billOverall/echart/dashboard/moneyExact',
    method: 'get'
  })
}

// 实收费用具体情况（dashboard---lineMarker）.
export function getEchartMoneyGotMonthly() {
  return request({
    url: '/onepark/billOverall/echart/moneyGet',
    method: 'get'
  })
}

// 周实收费用（dashboard---barChart).
export function getEchartMoneyGotWeekly() {
  return request({
    url: '/onepark/billOverall/echart/moneyGetWeekly',
    method: 'get'
  })
}
//新增月度电费统计.
export function addElectric(data) {
  return request({
    url: '/onepark/electricExport/addElectric',
    method: 'post',
    data
  })
}
