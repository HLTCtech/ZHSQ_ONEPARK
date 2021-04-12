/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 15:50:11
 * @Description: file content
 */
import request from '@/utils/request'

// 获取所有的通知公告.
export function fetchNoticeList(query) {
  return request({
    url: '/onepark/notice/list',
    method: 'post',
    data: { query }
  })
}

// 新增通知公告.
export function newNotice(query) {
  return request({
    url: '/onepark/notice/new',
    method: 'post',
    data: { query }
  })
}

// 修改通知公告.
export function changeNotice(query) {
  return request({
    url: '/onepark/notice/change',
    method: 'post',
    data: { query }
  })
}

// 删除通知公告.
export function deleteNotice(query) {
  return request({
    url: '/onepark/notice/delete',
    method: 'post',
    data: { query }
  })
}
