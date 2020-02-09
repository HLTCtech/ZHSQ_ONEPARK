import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/user/login',
    method: 'post',
    params: { loginForm }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getSMS(loginForm) {
  return request({
    url: '/user/getSMS',
    method: 'post',
    params: { loginForm }
  })
}
