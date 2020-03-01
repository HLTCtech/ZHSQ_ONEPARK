import request from '@/utils/request'

// 所有记录的list
export function fetchTrashLogList(listQuery_all) {
  return request({
    url: '/pay/trash/log/all',
    method: 'get',
    params: { listQuery_all }
  })
}

// 搜索记录search
export function fetchTrashLogSearch(listQuery_search) {
  return request({
    url: '/pay/trash/log/search',
    method: 'get',
    params: { listQuery_search }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/trash/log/searchById',
    method: 'get',
    params: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/trash/singleMoneyPost',
    method: 'post',
    params: { singleFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getTrashSMS(singleSMSPost) {
  return request({
    url: '/pay/trash/getSMS',
    method: 'post',
    params: { singleSMSPost }
  })
}

