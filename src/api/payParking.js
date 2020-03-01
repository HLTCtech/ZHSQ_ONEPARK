import request from '@/utils/request'

// 查询所有的地上停车信息
export function fetchListAll(query) {
  return request({
    url: '/pay/parking/all',
    method: 'get',
    params: query
  })
}

// 根据选定字段查询指定的车位信息
export function fetchSearch(query) {
  return request({
    url: '/pay/parking/search',
    method: 'get',
    params: { query }
  })
}

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

// 向后台提交表单（变更车位信息）
export function postChangeInfo(infoChangeFormPost) {
  return request({
    url: '/pay/parking/carInfoPost/change',
    method: 'post',
    params: { infoChangeFormPost }
  })
}

// 新增车位时当缴费方式为“特批”，调取sms
export function getSMSCode(newInfoFormPost) {
  return request({
    url: '/pay/parking/getSMS',
    method: 'post',
    params: { newInfoFormPost }
  })
}

