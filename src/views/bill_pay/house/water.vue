<template>
  <!-- 住宅收费界面 -->
  <div class="app-container">
    <!-- 定义表单提交项 -->
    <el-card class="box-card">
      <el-form ref="dataForm" :rules="formRules" :model="formPost" label-width="80px">
        <el-form-item label="房间号" label-width="100px" prop="houseId">
          <el-input v-model="formPost.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
        </el-form-item>
        <el-form-item>
          <el-switch v-model="payPattern" label="" label-width="100px" active-text="复合缴费" inactive-text="单一缴费" active-value="0" inactive-value="1" />
        </el-form-item>
        <el-form-item v-if="payPattern==1" label="单一缴费" label-width="100px" prop="singlePayType">
          <el-select v-model="formPost.singlePayType" placeholder="请选择">
            <el-option v-for="item in singlePayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="payPattern==0" label="复合缴费" label-width="100px" prop="mixPayType">
          <el-card class="box-card" style="width: 300px">
            <div style="width: 60px">支付宝：</div><el-input v-model="formPost.mixPayAlipay" type="number" style="width: 200px" placeholder="请输入金额" clearable /><br>
            <div style="width: 60px">微信：</div><el-input v-model="formPost.mixPayWechat" type="number" style="width: 200px" placeholder="请输入金额" clearable /><br>
            <div style="width: 60px">现金：</div><el-input v-model="formPost.mixPayCash" type="number" style="width: 200px" placeholder="请输入金额" clearable /><br>
            <div style="width: 60px">其他：</div><el-input v-model="formPost.mixPayOther" type="number" style="width: 200px" placeholder="请输入金额" clearable />
          </el-card>
        </el-form-item>
        <el-form-item label="缴费总金额" label-width="100px" prop="moneyNum" autocomplete="off">
          <el-input v-model.number="formPost.moneyNum" width="100px" />
        </el-form-item>
        <el-form-item label="备注" label-width="100px" prop="remark">
          <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleSubmitForm(formPost)">提交</el-button>
          <el-button @click="handleCleanDataForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 收费类型为特批时验证码模态框处理 -->
    <el-dialog width="40%" title="领导审批" style="top: 20%" :visible.sync="dialogApproveSmsVisible" append-to-body>
      <el-input
        ref="smsCode"
        v-model="formPost.smsCode"
        placeholder="请输入短信验证码"
        name="smsCode"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
      <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getSmsCode(formPost)">
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count"> {{ count }} s</span>
      </el-button>
      <br>
      <br>
      <el-button type="success" @click="handlePost(formPost)">确定提交</el-button>
      <el-button @click="handleCleanSMSDataForm()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postMoney, getWaterSMS } from '@/api/payWater'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'

export default {
  name: 'WaterPay',
  directives: { waves },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      dialogApproveSmsVisible: false,
      // 定义单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      // 付款类型选择器选项
      payOptions: [{ value: 'alipay', label: '支付宝' }, { value: 'wechat', label: '微信' }, { value: 'cash', label: '现金' }, { value: 'other', label: '其他' }],
      listLoading: true,
      // 定义表单提交项具体项目
      formPost: {
        houseId: null,
        moneyNum: null,
        singlePayType: null,
        remark: null,
        payItem: '住宅水费',
        adminId: this.$store.getters.adminId,
        smsCode: null,
        mixPayType: [{ mixPayAlipay: null, mixPayWechat: null, mixPayCash: null, mixPayOther: null }]
      },
      // 定义表单提交项目规则
      formRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        moneyNum: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }],
        singlePayType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }],
        mixPayType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }]
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
  },
  methods: {
    // 获取验证码按钮
    getSmsCode(formPost) {
      getWaterSMS(formPost).then(response => {
        if (response.codeStatus === 200) {
          this.$message({ message: '验证码会发送到您的手机上，请注意查收', type: 'success' })
        } else {
          this.$message({ message: '提交失败，请联系系统管理员', type: 'error' })
        }
      })
      // 更改获取验证码按钮倒计时
      const TIME_COUNT = 30 // 更改倒计时时间
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
          }
        }, 1000)
      }
    },
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
            // fetchSearchByHouseId(formPost.houseId).then(response => {
            //   this.titleData = response.data.titles
            //   this.tableColumns = response.data.items
            // })
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
          if (this.formPost.singlePayType === '特批') {
            this.dialogApproveSmsVisible = true
          } else {
            // 操作确认框
            this.$confirm('确定提交么？', '费用收缴', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
            //   console.log('formPost-----')
            //   console.log(formPost)
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
                //   fetchSearchByHouseId(formPost.houseId).then(response => {
                //     this.titleData = response.data.titles
                //     this.tableColumns = response.data.items
                //   })
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
