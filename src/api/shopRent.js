import request from '@/utils/request'

// 所有租金的list
export function fetchShopRentList(listQuery_all) {
  return request({
    url: '/pay/shopRent/all',
    method: 'get',
    params: { listQuery_all }
  })
}

// 搜索租金search
export function fetchShopRentSearch(listQuery_search) {
  return request({
    url: '/pay/shopRent/search',
    method: 'get',
    params: { listQuery_search }
  })
}

// 根据shopId查询应收费用信息
export function getRentShallPay(shopId) {
  return request({
    url: '/pay/shopRent/rentShallPayByShopId',
    method: 'get',
    params: { shopId }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSMS(formPost) {
  return request({
    url: '/pay/shopRent/getSMS',
    method: 'post',
    params: { formPost }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/shopRent/singleMoneyPost',
    method: 'post',
    params: { singleFormPost }
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

