import request from '@/utils/request'

// 缴费成功后的跳转逻辑，根据指定carLoc查询指定的住宅信息
export function fetchSearchByCarLoc(carLoc) {
  return request({
    url: '/pay/parking/searchByCarLoc',
    method: 'get',
    params: { carLoc }
  })
}

// 向后台提交表单（新增车位信息）
export function postNewCarInfo(newInfoFormPost) {
  return request({
    url: '/pay/parking/carInfoPost/new',
    method: 'post',
    params: { newInfoFormPost }
  })
}

// 向后台提交收费详情表单
export function postMoney(formPost) {
  return request({
    url: '/pay/water/moneyPost',
    method: 'post',
    params: { formPost }
  })
}

// 新增车位时当缴费方式为“特批”，调取sms
export function getWaterSMS(formPost) {
  return request({
    url: '/pay/water/getSMS',
    method: 'post',
    params: { formPost }
  })
}

// 变更车位时当缴费方式为“特批”，调取sms
export function getChangeParkingSMS(infoChangeFormPost) {
  return request({
    url: '/pay/parking/change/getSMS',
    method: 'post',
    params: { infoChangeFormPost }
  })
}
