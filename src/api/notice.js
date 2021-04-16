import request from '@/utils/request'

// 获取所有的通知公告
export function fetchNoticeList(query) {
  return request({
    url: '/onepark/notice/list',
    method: 'post',
    data: { query }
  })
}

// 新增通知公告
export function newNotice(query) {
  return request({
    url: '/onepark/notice/new',
    method: 'post',
    data: { query }
  })
}

// 修改通知公告
export function changeNotice(query) {
  return request({
    url: '/onepark/notice/change',
    method: 'post',
    data: { query }
  })
}

// 删除通知公告
export function deleteNotice(query) {
  return request({
    url: '/onepark/notice/delete',
    method: 'post',
    data: { query }
  })
}
