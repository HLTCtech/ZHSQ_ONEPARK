/*
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 16:28:37
 * @Description: file content
 */
import request from '@/utils/request'

export function getSMS(smsForm) {
  return request({
    url: '/onepark/pay/getSMS',
    method: 'post',
    params: { smsForm }
  })
}
