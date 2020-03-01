import request from '@/utils/request'

// 住宅相关api-------------------------------------
// 查询所有的住宅物业费信息
export function fetchHouseListAll(query) {
  return request({
    url: '/pay/property/house/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的住宅信息
export function fetchHouseSearch(query) {
  return request({
    url: '/pay/property/house/search',
    method: 'get',
    params: { query }
  })
}

// 商铺相关api-------------------------------------
// 查询所有的商铺物业费信息
export function fetchShopListAll(query) {
  return request({
    url: '/pay/property/shop/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的住宅信息
export function fetchShopSearch(query) {
  return request({
    url: '/pay/property/shop/search',
    method: 'get',
    params: { query }
  })
}

// 收费页面上方显示指定房间费用信息
export function fetchPreViewAll(houseId) {
  return request({
    url: '/pay/property/pv/all',
    method: 'get',
    params: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/property/singleMoneyPost',
    method: 'post',
    params: { singleFormPost }
  })
}

// 复合收费详情表单
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/pay/property/mixMoneyPost',
    method: 'post',
    params: { mixFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getPropertySMS(singleSMSPost) {
  return request({
    url: '/pay/water/getSMS',
    method: 'post',
    params: { singleSMSPost }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/property/searchById',
    method: 'get',
    params: { houseId }
  })
}
