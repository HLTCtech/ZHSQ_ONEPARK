import request from '@/utils/request'

// 住宅相关api-------------------------------------
// 查询所有的住宅信息
export function fetchHouseListAll(query) {
  return request({
    url: '/pay/electric/house/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的住宅信息
export function fetchHouseSearch(query) {
  return request({
    url: '/pay/electric/house/search',
    method: 'post',
    data: { query }
  })
}

// 住宅收费---获取经理验证码
export function getElectricSMS(singleSMSPost) {
  return request({
    url: '/pay/electric/house/getSMS',
    method: 'post',
    data: { singleSMSPost }
  })
}

// 商铺相关api-------------------------------------
// 查询所有商铺信息
export function fetchShopListAll(query) {
  return request({
    url: '/pay/electric/shop/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的商铺信息
export function fetchShopSearch(query) {
  return request({
    url: '/pay/electric/shop/search',
    method: 'post',
    data: { query }
  })
}

// 台账--搜索
// 根据选定字段查询指定的台账信息
export function fetchElectricStandingBookSearch(query) {
  return request({
    url: '/pay/electric/standingBook/search',
    method: 'post',
    data: { query }
  })
}

// 台账--list
// 展示电费台账所有信息
export function fetchStandingBookListAll(query) {
  return request({
    url: '/pay/electric/standingBook/all',
    method: 'get',
    params: query
  })
}

// 通知单--搜索
// 根据选定字段查询指定的通知单信息
export function fetchElectricNotificationSearch(query) {
  return request({
    url: '/pay/electric/notification/search',
    method: 'get',
    params: query
  })
}

// 通知单--list
// 展示电费通知单所有信息
export function fetchNotificationListAll(query) {
  return request({
    url: '/pay/electric/notification/all',
    method: 'get',
    params: query
  })
}

// 分隔线****************************************************************************
// 住宅商铺通用api
// 指定房号--电费状态统计的弹出模态框
export function fetchPreViewAll(houseId) {
  return request({
    url: '/pay/electric/pv/all',
    method: 'get',
    params: { houseId }
  })
}

// 指定月份--具体月份费用详情的弹出模态框
export function fetchPreViewSingle(pv, houseId) {
  return request({
    url: '/pay/electric/pv/single',
    method: 'get',
    params: pv, houseId
  })
}

// 展示所有月份的电表读数及费用信息
export function fetchAllDetailByMonth(houseId) {
  return request({
    url: '/pay/electric/details',
    method: 'get',
    params: { houseId }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/electric/searchById',
    method: 'get',
    params: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/electric/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 复合收费详情表单
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/pay/electric/mixMoneyPost',
    method: 'post',
    params: { mixFormPost }
  })
}
