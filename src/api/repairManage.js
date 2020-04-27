import request from '@/utils/request'

// 服务评价list
export function fetchrepairList(listQuery_all) {
  return request({
    url: '/property/repairManage/all',
    method: 'post',
    data: { listQuery_all }
  })
}

// 服务评价search
export function repairSearch(listQuery_search) {
  return request({
    url: '/property/repairManage/search',
    method: 'post',
    data: { listQuery_search }
  })
}

// 获取报修详情
export function getRepairContent(houseId, repairAddDate) {
  return request({
    url: '/property/repairManage/getRepairContent',
    method: 'post',
    data: { houseId, repairAddDate }
  })
}

// 报修状态变更
export function repairStatusChange(repairStatusForm) {
  return request({
    url: '/property/repairManage/repairStatusChange',
    method: 'post',
    data: { repairStatusForm }
  })
}

