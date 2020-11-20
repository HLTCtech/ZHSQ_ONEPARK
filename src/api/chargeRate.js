import request from '@/utils/request'

export function chargeRate(data,path) {
  return request({
    url: path,
    method: 'post',
    data
  })
}

