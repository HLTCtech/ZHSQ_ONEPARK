import request from '@/utils/request'

// 查询当前登录的操作人所有的收费记录
export function fetchAllCharging(listQuery) {
  return request({
    url: '/chargingVoucher/allByAdminId',
    method: 'get',
    params: { listQuery }
  })
}

