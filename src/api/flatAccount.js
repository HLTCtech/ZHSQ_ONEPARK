/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 15:46:51
 * @Description: file content
 */

import request from '@/utils/request'

//开户记录列表.
export function getListOpen(data) {
  return request({
    url: '/openaccount/getListOpen',
    method: 'post',
    data
  })
}
//开户记录搜索.
export function search(data) {
  return request({
    url: '/openaccount/search',
    method: 'post',
    data
  })
}
