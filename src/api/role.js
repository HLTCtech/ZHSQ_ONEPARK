/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:26:40
 * @Description: file content
 */
import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/onepark/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/onepark/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/onepark/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/onepark/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/onepark/role/${id}`,
    method: 'delete'
  })
}
