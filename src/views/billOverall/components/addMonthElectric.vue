<template>
  <el-dialog
    :visible="visible"
    @close="close"
    title="新增电费"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="formData" :rules="rules" ref="form" label-width="auto">
      <el-form-item label="房间号" prop="houseId">
        <el-input
          v-model="formData.houseId"
          placeholder="请输入房间号"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="总用电量" prop="electrictotal">
        <el-input
          v-model="formData.electrictotal"
          placeholder="请输入总用电量"
        ></el-input>
      </el-form-item>
      <el-form-item label="剩余金额" prop="electricsurmoney">
        <el-input
          v-model="formData.electricsurmoney"
          placeholder="请输入剩余金额"
        ></el-input>
      </el-form-item>
      <el-form-item label="总金额" prop="electricmoney">
        <el-input
          v-model="formData.electricmoney"
          placeholder="请输入总金额"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button @click="submit" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addElectric } from '@/api/billOverall'
export default {
  data() {
    const checkMoney = (rule, val, callback) => {
      if (!val) {
        return callback(new Error('请输入金额'))
      }
      if (/[\u4E00-\u9FA5]/.test(val)) {
        return callback(new Error('请输入正确的金额'))
      }
      if (Number(val) < 0) {
        return callback(new Error('金额不能为负数'))
      }
      callback()
    }
    return {
      visible: false,
      formData: {
        houseId: '', //房间号
        date: '', //时间
        electrictotal: '', //总用电量
        electricsurmoney: '', //剩余金额
        electricmoney: '' //总金额
      },
      rules: {
        houseId: [
          { required: true, message: '房间号不能为空', trigger: 'blur' }
        ],
        date: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
        electrictotal: [
          { required: true, validator: checkMoney, trigger: 'blur' }
        ],
        electricsurmoney: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        electricmoney: [
          { required: true, validator: checkMoney, trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  methods: {
    //提交新增电费函数
    submit() {
      this.$refs['form'].validate(val => {
        if (val) {
          console.log(this.formData)
          addElectric(this.formData)
            .then(res => {
              console.log(res)
              if (res.message === '添加成功') {
                this.$message.success(`${res.message}`)
                this.close()
                this.$emit('getList')
              } else {
                this.$message.error(`${res.message}`)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    //关闭对话框函数
    close() {
      this.visible = false
      this.formData = {
        houseId: '',
        date: '',
        electrictotal: '',
        electricsurmoney: '',
        electricmoney: ''
      }
    },
    open() {
      this.visible = true
    }
  }
}
</script>

<style></style>
