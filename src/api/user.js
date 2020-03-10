import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/admin/login',
    method: 'post',
    params: { loginForm }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getSMS(loginForm) {
  return request({
    url: '/admin/getSMS',
    method: 'post',
    params: { loginForm }
  })
}

export function getUserLog(adminId) {
  return request({
    url: '/admin/getLog',
    method: 'get',
    params: { adminId }
  })
}
