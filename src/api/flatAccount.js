import request from '@/utils/request'

//开户记录列表
export function getListOpen(data) {
  return request({
    url: '/openaccount/getListOpen',
    method: 'post',
    data
  })
}
//开户记录搜索
export function search(data) {
  return request({
    url: '/openaccount/search',
    method: 'post',
    data
  })
}
