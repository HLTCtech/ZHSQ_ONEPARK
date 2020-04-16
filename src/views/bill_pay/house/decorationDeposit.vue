<template>
  <!-- 住宅装修保证金收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
      <el-select v-model="listQuery_search.year" placeholder="选择年份" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in yearOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery_search.datePicker"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="handleMoneyGet">
      费用收缴
    </el-button>

    <br>
    <br>

    <!-- 表格 -->
    <el-table highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="交款日期" prop="paidDate" align="center" />
      <el-table-column label="实收金额" prop="moneyGet" align="center" />
      <el-table-column label="退款日期" prop="moneyReturnDate" align="center" />
      <el-table-column label="退款金额" prop="moneyReturnNum" align="center" />
      <el-table-column label="差额" prop="gap" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="退款" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <!-- 收费按钮相对应的模态框以及函数暂未开发 -->
          <el-button type="primary" size="mini" @click="handleMoneyReturn(row)">
            退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击houseId弹出信息变更历史模态框 -->
    <el-dialog :visible.sync="dialogHouseLog" title="房屋信息变更历史">
      <el-table :data="pvData_all" fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="houseName" label="业主姓名" />
        <el-table-column prop="housePhone" label="业主手机号" />
        <el-table-column prop="houseArea" label="住宅面积" />
        <el-table-column prop="basementArea" label="地下室面积" />
        <el-table-column prop="changeTime" label="变更时间" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHouseLog = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 费用收缴按钮的模态框 -->
    <el-dialog :visible.sync="dialogMoneyGetFormVisible" title="费用收缴">

      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form ref="dataForm" :rules="formRules" :model="formPost" label-width="80px">
          <el-form-item label="房号" label-width="100px" prop="houseId">
            <el-input v-model="formPost.houseId" placeholder="请输入房号（多个房间请用'/'间隔；如16-101/16-102" />
          </el-form-item>
          <el-form-item label="客户姓名" label-width="100px" prop="houseName">
            <el-input v-model="formPost.houseName" />
          </el-form-item>
          <el-form-item label="缴费方式" label-width="100px" prop="singlePayType">
            <el-select v-model="formPost.payType" placeholder="请选择">
              <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费金额" label-width="100px" prop="moneyGet">
            <el-input v-model.number="formPost.moneyGet" />
          </el-form-item>
          <el-form-item label="交款日期" label-width="100px" prop="paidDate">
            <div class="block">
              <el-date-picker v-model="formPost.paidDate" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
            </div>
          </el-form-item>
          <el-form-item label="差额" label-width="100px" prop="gap">
            <el-input v-model="formPost.moneyGet" disabled />
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitForm(formPost)">提交</el-button>
            <el-button @click="handleCleanDataFormReturn()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 收费类型为特批时验证码模态框处理 -->
    <el-dialog width="40%" title="领导审批" style="top: 20%" :visible.sync="dialogSMSVisible" append-to-body>
      <el-input
        ref="smsCode"
        v-model="formPost.smsCode"
        placeholder="请输入短信验证码"
        name="smsCode"
        type="number"
        tabindex="1"
        autocomplete="on"
      />
      <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getSmsCode(SMSPost)">
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count"> {{ count }} s</span>
      </el-button>
      <br>
      <br>
      <el-button type="success" @click="handleSMSPost(formPost)">确定提交</el-button>
      <el-button @click="handleCleanSMS()">取消</el-button>
    </el-dialog>

    <!-- 退款按钮的模态框 -->
    <el-dialog :visible.sync="dialogMoneyReturn" title="退款">

      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form ref="dataFormReturn" :rules="formRulesReturn" :model="formReturn" label-width="80px">
          <el-form-item label="房号" label-width="100px" prop="houseId">
            <el-input v-model="formReturn.houseId" placeholder="请输入房号（多个房间请用'/'间隔；如16-101/16-102" disabled />
          </el-form-item>
          <el-form-item label="客户姓名" label-width="100px" prop="houseName">
            <el-input v-model="formReturn.houseName" disabled />
          </el-form-item>
          <el-form-item label="退款方式" label-width="100px" prop="payTypeReturn">
            <el-select v-model="formReturn.payTypeReturn" placeholder="请选择">
              <el-option v-for="item in payOptionsReturn" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="退款金额" label-width="100px" prop="moneyReturn">
            <el-input v-model.number="formReturn.moneyReturn" />
          </el-form-item>
          <el-form-item label="退款日期" label-width="100px" prop="returnDate">
            <div class="block">
              <el-date-picker v-model="formReturn.returnDate" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
            </div>
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="formReturn.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitFormReturn(formReturn)">提交</el-button>
            <el-button @click="handleCleanDataFormReturn()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="handleFilter" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchHouseDecorationDepositListAll, fetchHouseDecorationDepositSearch, postMoney, returnMoney, fetchSearchByHouseId, getSMS } from '@/api/payDecorationDeposit'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DecorationDepositPay',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      show: true,
      count: '',
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        year: null,
        houseName: null,
        datePicker: null
      },
      // 时间选择器返回数据
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
        page: 1,
        year: 2020
      },
      formPost: {
        houseId: null,
        houseName: null,
        paidDate: null,
        moneyGet: null,
        payType: null,
        remark: null,
        gap: null,
        smsCode: null,
        adminId: this.$store.getters.adminId
      },
      formReturn: {
        houseId: null,
        houseName: null,
        payTypeReturn: null,
        moneyReturn: null,
        returnDate: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      // 调取短信验证码提交项目
      SMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '住宅装修保证金'
      },
      // 单一缴费时的选项
      payOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      // 退款时的选项
      payOptionsReturn: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }],
      // 定义表单提交项目规则
      formRules: {
        houseId: [{ required: true, message: '请输入房号（多个房间请用"/"间隔；如16-101/16-102）', trigger: 'blur' }],
        houseName: [{ required: true, message: '请输入客户姓名' }],
        moneyGet: [{ required: true, message: '请输入实收金额(纯数字)', type: 'number', trigger: 'blur' }],
        paidDate: [{ required: true, message: '请选择交款日期', trigger: 'blur' }],
        payType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }]
      },
      formRulesReturn: {
        moneyReturn: [{ required: true, message: '请输入退款金额(纯数字)', type: 'number', trigger: 'blur' }],
        returnDate: [{ required: true, message: '请选择退款日期', trigger: 'blur' }],
        payTypeReturn: [{ required: true, message: '请选择退款方式', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      dialogMoneyGetFormVisible: false,
      dialogMoneyReturn: false,
      dialogHouseLog: false,
      // 声明下api变量
      tableData: [],
      pvData_all: []
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
    getList() {
      fetchHouseDecorationDepositListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchHouseDecorationDepositSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    },
    handleMoneyGet() {
      this.dialogMoneyGetFormVisible = true
    },
    handleMoneyReturn(row) {
      this.formReturn.houseId = row.houseId
      this.formReturn.houseName = row.houseName
      this.dialogMoneyReturn = true
    },
    // 获取验证码按钮
    getSmsCode(SMSPost) {
      SMSPost.houseId = this.formPost.houseId
      getSMS(SMSPost).then(response => {
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
    handleSMSPost(formPost) {
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

            this.dialogSMSVisible = false
            this.dialogMoneyGetFormVisible = false
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.formPost.smsCode = ''
            })
            fetchSearchByHouseId(formPost.houseId).then(response => {
              this.tableData = response.data.items
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
    // 单一收费提交收费表单
    handleSubmitForm(formPost) {
      this.formPost.gap = this.formPost.moneyGet
      // 表单项规则验证
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.formPost.payType === '特批') {
            this.dialogSMSVisible = true
          } else {
            // 操作确认框
            this.$confirm('确定提交么？', '费用收缴', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              // this.formPost.paidTotalNum = this.singlePayTotal
              postMoney(formPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.formPost.smsCode = ''
                  })
                  this.dialogMoneyGetFormVisible = false
                  fetchSearchByHouseId(formPost.houseId).then(response => {
                    this.tableData = response.data.items
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
    },
    // 退款表单
    handleSubmitFormReturn(formReturn) {
      // 表单项规则验证
      this.$refs['dataFormReturn'].validate((valid) => {
        if (valid) {
        // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            returnMoney(formReturn).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['dataFormReturn'].resetFields()
                })
                this.dialogMoneyReturn = false
                fetchSearchByHouseId(formReturn.houseId).then(response => {
                  this.tableData = response.data.items
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
      })
    },
    // 获取验证码页面取消按钮
    handleCleanSMS() {
      this.formPost.smsCode = ''
      this.dialogSMSVisible = false
    },
    handleCleanDataForm() {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.dialogMoneyGetFormVisible = false
    },
    handleCleanDataFormReturn() {
      if (this.$refs['dataForm'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }
      if (this.$refs['dataFormReturn'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['dataFormReturn'].resetFields()
        })
      }
      this.dialogMoneyGetFormVisible = false
      this.dialogMoneyReturn = false
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      if (houseId === '') {
        this.$message('这条数据没有房号')
      } else {
        getLogByHouseId(houseId).then(response => {
          this.pvData_all = response.data.pvData
          this.dialogHouseLog = true
        })
      }
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
