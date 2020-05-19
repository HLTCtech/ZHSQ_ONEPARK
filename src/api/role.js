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
