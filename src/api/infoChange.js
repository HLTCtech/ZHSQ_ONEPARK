import request from '@/utils/request'

// 查询所有房间具体信息
export function fetchHouseInfoAll(query) {
  return request({
    url: '/onepark/info/houseChange/all',
    method: 'post',
    data: { query }
  })
}

// 查询所有房间具体信息
export function fetchHouseInfoSearch(query) {
  return request({
    url: '/onepark/info/houseChange/search',
    method: 'post',
    data: { query }
  })
}

// 向后台提交表单（房屋面积变更）
export function postHouseInfoArea(formPost) {
  return request({
    url: '/onepark/info/houseChange/areaChangePost',
    method: 'post',
    data: { formPost }
  })
}

// 向后台提交表单（业主信息变更）
export function postHouseInfoUser(formPost) {
  return request({
    url: '/onepark/info/houseChange/userChangePost',
    method: 'post',
    data: { formPost }
  })
}

// 向后台提交表单（房间状态变更）
export function postHouseInfoStatus(formPost) {
  return request({
    url: '/onepark/info/houseChange/statusChangePost',
    method: 'post',
    data: { formPost }
  })
}

// 向后台提交表单（房间费率变更）
export function postHouseInfoRate(formPost) {
  return request({
    url: '/onepark/info/houseChange/rateChangePost',
    method: 'post',
    data: { formPost }
  })
}

// 缴费成功后的跳转逻辑，根据指定houseId查询指定的住宅信息
export function fetchHouseInfoByHouseId(houseId) {
  return request({
    url: '/onepark/info/houseChange/searchById',
    method: 'post',
    data: { houseId }
  })
}

// 向后台提交表单（新增信息）
export function postNewHouseInfo(newInfoFormPost) {
  return request({
    url: '/onepark/info/houseChange/infoPost/new',
    method: 'post',
    data: { newInfoFormPost }
  })
}

/* 上传文件 */
export function upload(data) {
  return request({
    url: '/infoChange/upload',
    method: 'post',
    data,
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  })
}