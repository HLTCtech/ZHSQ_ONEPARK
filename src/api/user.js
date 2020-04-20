import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/admin/login',
    method: 'post',
    params: loginForm
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/admin/logout',
    method: 'post',
    params: { token }
  })
}

export function getSMS(loginForm) {
  return request({
    url: '/admin/getSMS',
    method: 'post',
    params: loginForm
  })
}

export function getUserLog(adminId) {
  return request({
    url: '/admin/getLog',
    method: 'get',
    params: { adminId }
  })
}

// 获取所有的操作员信息
export function fetchOperatorList(query) {
  return request({
    url: '/admin/operator/list',
    method: 'post',
    data: { query }
  })
}

// 搜索指定操作员信息
export function fetchOperatorSearch(query) {
  return request({
    url: '/admin/operator/search',
    method: 'post',
    data: { query }
  })
}

// 提交新的操作员信息
export function newOperatorPost(newAdminForm) {
  return request({
    url: '/admin/operator/new',
    method: 'post',
    data: { newAdminForm }
  })
}

// 变更操作员信息提交
export function infoChangeOperatorPost(operatorInfoChangeForm) {
  return request({
    url: '/admin/operator/infoChange',
    method: 'post',
    data: { operatorInfoChangeForm }
  })
}

// 根据operatorId获取信息
export function fetchSearchByOperatorId(operatorId) {
  return request({
    url: '/admin/operator/searchById',
    method: 'post',
    data: { operatorId }
  })
}
