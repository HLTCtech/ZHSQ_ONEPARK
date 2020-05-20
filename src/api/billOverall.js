import request from '@/utils/request'

// 查询所有的物业收费流水信息
export function fetchPropertyWaterBillListAll(query) {
  return request({
    url: '/billOverall/propertyWaterBill/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的物业收费流水信息
export function fetchPropertyWaterBillSearch(query) {
  return request({
    url: '/billOverall/propertyWaterBill/search',
    method: 'post',
    data: { query }
  })
}

// 查询所有的装修保证金台账
export function fetchDecorationDepositListAll(query) {
  return request({
    url: '/billOverall/decorationDeposit/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的装修保证金台账
export function fetchDecorationDepositSearch(query) {
  return request({
    url: '/billOverall/decorationDeposit/search',
    method: 'post',
    data: { query }
  })
}

// 查询费用累计信息
export function fetchBillList(query) {
  return request({
    url: '/billOverall/billAddUp/dashboard/all',
    method: 'get',
    params: { query }
  })
}

// 获取当月应收数额（dashboard---panel）
export function getEchartMoneyAllMonthly() {
  return request({
    url: '/billOverall/echart/dashboard/moneyGetMonthly',
    method: 'get'
  })
}

// 每月费用具体情况（dashboard---line）
export function getEchartMoneyMonthly() {
  return request({
    url: '/billOverall/echart/dashboard/moneyExact',
    method: 'get'
  })
}

// 实收费用具体情况（dashboard---lineMarker）
export function getEchartMoneyGotMonthly() {
  return request({
    url: '/billOverall/echart/moneyGet',
    method: 'get'
  })
}

// 周实收费用（dashboard---barChart)
export function getEchartMoneyGotWeekly() {
  return request({
    url: '/billOverall/echart/moneyGetWeekly',
    method: 'get'
  })
}
