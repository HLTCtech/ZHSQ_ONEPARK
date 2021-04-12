import request from '@/utils/request'

// 所有记录的list.
export function fetchBillRemindList(listQuery_all) {
  return request({
    url: '/onepark/pay/billRemind/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 搜索记录search.
export function fetchBillRemindSearch(listQuery_search) {
  return request({
    url: '/onepark/pay/billRemind/search',
    method: 'post',
    data: { listQuery_search }
  })
}

