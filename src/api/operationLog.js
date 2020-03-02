import request from '@/utils/request'

// 所有的页面点击houseId获取房屋信息变更历史
export function getLogByHouseId(houseId) {
  return request({
    url: '/operationLog/getLogByHouseId',
    method: 'get',
    params: { houseId }
  })
}

