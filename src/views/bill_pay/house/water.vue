<template>
  <!-- 住宅收费界面 -->
  <div class="app-container">
    <!-- 定义表单提交项 -->
    <el-card class="box-card">
      <el-form ref="dataForm" :rules="formRules" :model="formPost" label-width="80px">
        <el-form-item label="房间号" prop="houseId">
          <el-input v-model="formPost.houseId" />
        </el-form-item>
        <el-form-item label="缴费金额" prop="moneyNum" autocomplete="off">
          <el-input v-model.number="formPost.moneyNum" width="100px" />
        </el-form-item>
        <el-form-item>
          <el-switch v-model="payPattern" active-text="复合缴费" inactive-text="单一缴费" active-value="0" inactive-value="1" />
        </el-form-item>
        <el-form-item v-if="payPattern==1" label="单一缴费" prop="payType" required>
          <el-select v-model="singlePayValue" placeholder="请选择">
            <el-option v-for="item in singlePayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="payPattern==0" label="复合缴费" prop="payType" required>
          <el-card class="box-card" style="width: 300px">
            支付宝<el-input v-model="input" style="width: 200px" placeholder="请输入金额" clearable /><br>
            微信 <el-input v-model="input" style="width: 200px" placeholder="请输入金额" clearable /><br>
            现金 <el-input v-model="input" style="width: 200px" placeholder="请输入金额" clearable /><br>
            其他 <el-input v-model="input" style="width: 200px" placeholder="请输入金额" clearable />
            添加一个金额总计
          </el-card>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleSubmitForm(formPost)">提交</el-button>
          <el-button @click="handleCleanDataForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postMoney, fetchSearchByHouseId } from '@/api/payElectric'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'

export default {
  name: 'ElectricHousePay',
  directives: { waves },
  data() {
    return {
      payPattern: true,
      props: { multiple: true },
      // 定义单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      singlePayValue: '',
      // 付款类型选择器选项
      payOptions: [{ value: 'alipay', label: '支付宝' }, { value: 'wechat', label: '微信' }, { value: 'cash', label: '现金' }, { value: 'other', label: '其他' }],
      listLoading: true,
      // 定义表单提交项具体项目
      formPost: {
        houseId: null,
        dateRange: null,
        moneyNum: null,
        payType: null,
        remark: null,
        payItem: '住宅电费',
        adminId: this.$store.getters.adminId,
        smsCode: null
      },
      // 定义表单提交项目规则
      formRules: {
        // date1: [{ required: true, message: '请选择时间周期起始日期', type: 'date', trigger: 'change' }],
        // date2: [{ required: true, message: '请选择时间周期终点日期', type: 'date', trigger: 'change' }],
        dateRange: [{ required: true, message: '请选择时间周期' }],
        moneyNum: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }],
        payType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 缴款类型是特批时，验证码点击提交的收费表单
    handlePost(formPost) {
      if (formPost.smsCode === null || formPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        postMoney(formPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogApproveSmsVisible = false
            this.dialogMoneyGetFormVisible = false
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.formPost.smsCode = ''
            })
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchSearchByHouseId(formPost.houseId).then(response => {
              this.titleData = response.data.titles
              this.tableColumns = response.data.items
            })
          } else {
            this.$notify({
              title: 'Failure',
              message: '提交失败，请联系系统管理员',
              type: 'error',
              duration: 3000
            })
          }
        })
      }
    },
    // 提交收费表单
    handleSubmitForm(formPost) {
      // 表单项规则验证
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.formPost.payType === '特批') {
            this.dialogApproveSmsVisible = true
          } else {
            // 操作确认框
            this.$confirm('确定提交么？', '费用收缴', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              console.log('formPost-----')
              console.log(formPost)
              postMoney(formPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.dialogMoneyGetFormVisible = false
                  this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                  })
                  // 逻辑可能存在问题，比如id如何传到页面上
                  // 暂未测试
                  // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
                  fetchSearchByHouseId(formPost.houseId).then(response => {
                    this.titleData = response.data.titles
                    this.tableColumns = response.data.items
                  })
                } else {
                  this.$notify({
                    title: 'Failure',
                    message: '提交失败，请联系系统管理员',
                    type: 'error',
                    duration: 3000
                  })
                }
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.show-sms {
    position: absolute;
    right: 10px;
    top: 82px;
    font-size: 15px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }

  </style>
