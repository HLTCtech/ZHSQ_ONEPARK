import request from '@/utils/request'

// 所有记录的list
export function fetchSundriesLogList(listQuery_all) {
  return request({
    url: '/pay/sundries/log/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索记录search
export function fetchSundriesLogSearch(listQuery_search) {
  return request({
    url: '/pay/sundries/log/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/sundries/log/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/sundries/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getSundriesSMS(singleSMSPost) {
  return request({
    url: '/pay/sundries/getSMS',
    method: 'post',
    data: { singleSMSPost }
  })
}

