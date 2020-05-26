import request from '@/utils/request'

// 住宅相关api-------------------------------------
// 查询所有的住宅物业费信息
export function fetchHouseListAll(query) {
  return request({
    url: '/onepark/pay/property/house/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的住宅信息
export function fetchHouseSearch(query) {
  return request({
    url: '/onepark/pay/property/house/search',
    method: 'post',
    data: { query }
  })
}

// 商铺相关api-------------------------------------
// 查询所有的商铺物业费信息
export function fetchShopListAll(query) {
  return request({
    url: '/onepark/pay/property/shop/all',
    method: 'post',
    data: query
  })
}

// 根据选定字段查询指定的住宅信息
export function fetchShopSearch(query) {
  return request({
    url: '/onepark/pay/property/shop/search',
    method: 'post',
    data: { query }
  })
}

// 收费页面上方显示指定房间费用信息
export function fetchPreViewAll(houseId) {
  return request({
    url: '/onepark/pay/property/pv/all',
    method: 'post',
    data: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/onepark/pay/property/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 复合收费详情表单
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/onepark/pay/property/mixMoneyPost',
    method: 'post',
    data: { mixFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getPropertySMS(singleSMSPost) {
  return request({
    url: '/onepark/pay/property/getSMS',
    method: 'post',
    data: { singleSMSPost }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/onepark/pay/property/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 监听前端物业费周期并返回对应金额
export function getRealtimeProperty(query) {
  return request({
    url: '/onepark/pay/property/getRealtimeProperty',
    method: 'post',
    data: { query }
  })
}

// 指定物业费开始时间周期
export function postDaterangeStart(query) {
  return request({
    url: '/onepark/pay/property/postDaterangeStart',
    method: 'post',
    data: { query }
  })
}
