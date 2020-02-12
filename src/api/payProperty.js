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
