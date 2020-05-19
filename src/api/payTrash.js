import request from '@/utils/request'

// 所有记录的list
export function fetchTrashLogList(listQuery_all) {
  return request({
    url: '/pay/trash/log/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索记录search
export function fetchTrashLogSearch(listQuery_search) {
  return request({
    url: '/pay/trash/log/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 缴费成功后查询指定id的操作记录
export function fetchSearchByHouseId(houseId) {
  return request({
    url: '/pay/trash/log/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 单一收费详情表单
export function singleMoneyPost(singleFormPost) {
  return request({
    url: '/pay/trash/singleMoneyPost',
    method: 'post',
    data: { singleFormPost }
  })
}

// 当缴费方式为“特批”，调取sms
export function getTrashSMS(singleSMSPost) {
  return request({
    url: '/pay/trash/getSMS',
    method: 'post',
    data: { singleSMSPost }
  })
}

// 根据houseId返回业主姓名和应缴金额
export function getHouseNameMoneyShallPay(houseId) {
  return request({
    url: '/pay/trash/getHouseNameMoneyShallPay',
    method: 'post',
    data: { houseId }
  })
}

