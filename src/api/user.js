/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:29:22
 * @Description: file content
 */
import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/onepark/admin/login',
    method: 'post',
    params: loginForm
  })
}

export function getInfo(token) {
  return request({
    url: '/onepark/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/onepark/admin/logout',
    method: 'post',
    params: { token }
  })
}

export function getSMS(loginForm) {
  return request({
    url: '/onepark/admin/getSMS',
    method: 'post',
    params: loginForm
  })
}

export function getUserLog(adminId) {
  return request({
    url: '/onepark/admin/getLog',
    method: 'get',
    params: { adminId }
  })
}

// 获取所有的操作员信息
export function fetchOperatorList(query) {
  return request({
    url: '/onepark/admin/operator/list',
    method: 'post',
    data: { query }
  })
}

// 搜索指定操作员信息
export function fetchOperatorSearch(query) {
  return request({
    url: '/onepark/admin/operator/search',
    method: 'post',
    data: { query }
  })
}

// 提交新的操作员信息
export function newOperatorPost(newAdminForm) {
  return request({
    url: '/onepark/admin/operator/new',
    method: 'post',
    data: { newAdminForm }
  })
}

// 变更操作员信息提交
export function infoChangeOperatorPost(operatorInfoChangeForm) {
  return request({
    url: '/onepark/admin/operator/infoChange',
    method: 'post',
    data: { operatorInfoChangeForm }
  })
}

// 根据operatorId获取信息
export function fetchSearchByOperatorId(operatorId) {
  return request({
    url: '/onepark/admin/operator/searchById',
    method: 'post',
    data: { operatorId }
  })
}
