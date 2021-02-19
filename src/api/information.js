import request from '@/utils/request'
/* ********************基础信息API******************** */

/* ---------------杂费类型--------------- */

//获取所有杂费项(含搜索)
export function sundriesListall(data) {
  return request({
    url: '/onepark/pay/sundries/listall',
    method: 'post',
    data
  })
}
//新增杂费项
export function sundriesAdd(data) {
  return request({
    url: '/onepark/pay/sundries/add',
    method: 'post',
    data
  })
}
//删除杂费项
export function sundriesDelete(data) {
  return request({
    url: '/onepark/pay/sundries/delete',
    method: 'post',
    data
  })
}
//可用杂费项
export function sundriesList(data) {
  return request({
    url: '/onepark/pay/sundries/list',
    method: 'post',
    data
  })
}

/* ---------------科目编码--------------- */

//科目编码列表(含搜索)
export function subjectList(data) {
  return request({
    url: '/onepark/subjectCode/subjectList',
    method: 'post',
    data
  })
}
//新增科目编码
export function subjectNew(data) {
  return request({
    url: '/onepark/subjectCode/subjectNew',
    method: 'post',
    data
  })
}
//删除科目编码
export function subjectCodeDelete(data) {
  return request({
    url: '/onepark/subjectCode/delete',
    method: 'post',
    data
  })
}

/* ---------------往来编码--------------- */

//往来编码列表(含搜索)
export function contactunitList(data) {
  return request({
    url: '/onepark/subjectCode/contactunitList',
    method: 'post',
    data
  })
}
//往来编码删除
export function deleteContactUnit(data) {
  return request({
    url: '/onepark/subjectCode/deleteContactUnit',
    method: 'post',
    data
  })
}
//往来编码新增
export function subjectCodeAdd(data) {
  return request({
    url: '/onepark/subjectCode/add',
    method: 'post',
    data
  })
}
