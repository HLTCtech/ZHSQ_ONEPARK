import request from '@/utils/request'

// 所有记录的list
export function fetchHeatLogList(listQuery_all) {
  return request({
    url: '/pay/heat/log/all',
    method: 'get',
    params: { listQuery_all }
  })
}

// 搜索记录search
export function fetchHeatLogSearch(listQuery_search) {
  return request({
    url: '/pay/heat/log/search',
    method: 'get',
    params: { listQuery_search }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/heat/log/searchById',
    method: 'get',
    params: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/heat/singleMoneyPost',
    method: 'post',
    params: { singleFormPost }
  })
}

// 复合收费详情表单
export function mixMoneyPost(mixFormPost) {
  return request({
    url: '/pay/heat/mixMoneyPost',
    method: 'post',
    params: { mixFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getHeatSMS(singleSMSPost) {
  return request({
    url: '/pay/heat/getSMS',
    method: 'post',
    params: { singleSMSPost }
  })
}

