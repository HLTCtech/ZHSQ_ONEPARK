import request from '@/utils/request'

export function getSMS(smsForm) {
  return request({
    url: '/pay/getSMS',
    method: 'post',
    params: { smsForm }
  })
}
