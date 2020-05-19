import request from '@/utils/request'

// 所有租金的list
export function fetchShopRentList(listQuery_all) {
  return request({
    url: '/pay/shopRent/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索租金search
export function fetchShopRentSearch(listQuery_search) {
  return request({
    url: '/pay/shopRent/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 根据shopId查询应收费用信息
export function getRentShallPay(shopId) {
  return request({
    url: '/pay/shopRent/rentShallPayByShopId',
    method: 'post',
    data: { shopId }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/pay/shopRent/getSMS',
    method: 'post',
    data: { formPost }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/shopRent/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 复合收费详情表单
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/pay/shopRent/mixMoneyPost',
    method: 'post',
    data: { mixFormPost }
  })
}

// TEST----------所有租金的list
export function fetchShopRentListTest(listQuery_all) {
  return request({
    url: '/pay/shopRent/allTest',
    method: 'post',
    data: { listQuery_all }
  })
}

// TEST----------搜索租金search
export function fetchShopRentSearchTest(listQuery_search) {
  return request({
    url: '/pay/shopRent/searchTest',
    method: 'post',
    data: { listQuery_search }
  })
}
