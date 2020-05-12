<template>
  <!-- 商铺物业费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
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

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" height="1000" border stripe highlight-current-row>
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="houseType" align="center" fixed />
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="房屋状况" prop="houseStatus" align="center" fixed />
      <el-table-column label="交款日期" prop="paidDate" align="center" />
      <el-table-column label="面积" prop="area" align="center" />
      <el-table-column label="收费标准(元/㎡)" prop="chargingStandard" align="center" />
      <el-table-column label="应缴费日期" prop="houseShallPayDate" align="center" />
      <el-table-column label="截止日期" prop="houseDeadline" align="center" />
      <el-table-column label="到期验证" prop="houseClosingVerify" align="center" />
      <el-table-column label="逾期天数" prop="houseOverdueDays" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.houseOverdueDays >= 0 ? 'danger' : 'success'" disable-transitions>{{ scope.row.houseOverdueDays }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="费用收缴" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <!-- 收费按钮相对应的模态框以及函数暂未开发 -->
          <el-button type="primary" size="mini" @click="handleMoneyGet(row.houseId, row.houseName)">
            收缴
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

    <!-- 收费页面模态框 -->
    <el-dialog :visible.sync="dialogMoneyPost" title="费用收缴">
      <!-- 展示当前房间的费用状态统计 -->
      <el-table :data="tableDataPvAll" border fit highlight-current-row style="width: 100%" align="center">
        <el-table-column prop="houseId" label="房间号" align="center" />
        <el-table-column prop="houseShallPayDate" label="应缴费日期" align="center" />
        <el-table-column prop="houseDeadline" label="截止日期" align="center" />
        <el-table-column prop="houseOverdueDays" label="逾期天数" align="center" />
        <el-table-column prop="houseMonths" label="月数" align="center" />
        <el-table-column prop="houseShallPayProperty" label="应交物业费" align="center" />
      </el-table>
      <br>

      <el-card class="box-card">
        <!-- 定义表单提交项 -->
        <el-switch v-model="payPattern" label="" label-width="100px" active-text="复合缴费" inactive-text="单一缴费" active-value="0" inactive-value="1" />
        <br>
        <br>

        <!-- 选择单一缴费时的提交表单 -->
        <div v-if="payPattern==1" label="单一缴费" label-width="100px">
          <el-form ref="singleDataForm" :rules="singleformRules" :model="singleFormPost" label-width="80px">
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input v-model="singleFormPost.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
            </el-form-item>
            <el-form-item label="业主姓名" label-width="100px" prop="houseName">
              <el-input v-model="singleFormPost.houseName" placeholder="请输入业主姓名" />
            </el-form-item>
            <el-form-item label="缴费周期" label-width="100px" prop="singlePayDateRange">
              <el-date-picker
                v-model="singleFormPost.singlePayDateRange"
                class="filter-item"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-tag size="large" type="info" style="width: 100px;text-align:center;margin-left: 100px;margin-bottom:20px;" class="payType-item" disabled>应缴金额</el-tag>
            <el-tag size="large" type="primary" style="width: 200px;text-align:center;" class="payType-item" disabled>{{ singlePropertyShallPay }}</el-tag>
            <el-form-item label="缴费方式" label-width="100px" prop="singlePayType">
              <el-select v-model="singleFormPost.singlePayType" placeholder="请选择">
                <el-option v-for="item in singlePayOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="缴费金额" label-width="100px" prop="singlePayMoney">
              <el-input v-model.number="singleFormPost.singlePayMoney" type="number" style="width: 200px" placeholder="请输入金额" />
            </el-form-item>

            <el-form-item label="代金券金额" label-width="100px" prop="voucher">
              <el-input v-model="singleFormPost.voucher" placeholder="请输入代金券金额" />
            </el-form-item>
            <el-form-item label="实收总金额" label-width="100px">
              <el-input v-model.number="singlePayTotal" width="100px" disabled />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input v-model="singleFormPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="singleSubmitFormPost(singleFormPost)">提交</el-button>
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 选择复合缴费时的提交表单 -->
        <div v-if="payPattern==0" label="复合缴费" label-width="100px">
          <el-form ref="mixDataForm" :rules="mixformRules" :model="mixFormPost" label-width="80px">
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input v-model="mixFormPost.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
            </el-form-item>
            <el-form-item label="业主姓名" label-width="100px" prop="houseName">
              <el-input v-model="mixFormPost.houseName" placeholder="请输入业主姓名" />
            </el-form-item>
            <el-form-item label="缴费周期" label-width="100px" prop="mixPayDateRange">
              <el-date-picker
                v-model="mixFormPost.mixPayDateRange"
                class="filter-item"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-tag size="large" type="info" style="width: 100px;text-align:center;margin-left: 100px;margin-bottom:20px;" class="payType-item" disabled>应缴金额</el-tag>
            <el-tag size="large" type="primary" style="width: 200px;text-align:center;" class="payType-item" disabled>{{ mixPropertyShallPay }}</el-tag>
            <el-form-item label="支付宝" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[0].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="微信" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[1].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="现金" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[2].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="其他" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[3].value" type="number" style="width: 200px" placeholder="请输入金额" />
            </el-form-item>
            <el-form-item label="总金额" label-width="100px">
              <el-input v-model.number="mixPayTotal" width="100px" disabled />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input v-model="mixFormPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="mixSubmitFormPost(mixFormPost)">提交</el-button>
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 收费类型为特批时验证码模态框处理 -->
        <el-dialog width="40%" title="领导审批" style="top: 20%" :visible.sync="dialogSMSVisible" append-to-body>
          <el-input
            ref="smsCode"
            v-model="singleFormPost.smsCode"
            placeholder="请输入短信验证码"
            name="smsCode"
            type="number"
            tabindex="1"
            autocomplete="on"
          />
          <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getSmsCode(singleSMSPost)">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count"> {{ count }} s</span>
          </el-button>
          <br>
          <br>
          <el-button type="success" @click="handleSMSPost(singleFormPost)">确定提交</el-button>
          <el-button @click="handleCleanSMS()">取消</el-button>
        </el-dialog>
      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="fetchListSearch" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchShopListAll, fetchShopSearch, singleMoneyPost, mixMoneyPost, getPropertySMS, fetchSearchByHouseId, fetchPreViewAll, getRealtimeProperty } from '@/api/payProperty'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PayHouseProperty',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        houseName: null,
        datePicker: null
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      // 声明下api变量
      tableData: [],
      pvData_all: [],
      tableDataPvAll: [],
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
      // 单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '商铺物业费'
      },
      // 单一缴费表单提交项目
      singleFormPost: {
        houseId: null,
        houseName: null,
        singlePayType: null,
        singlePayMoney: null,
        remark: null,
        payItem: '商铺物业费',
        adminId: this.$store.getters.adminId,
        smsCode: null,
        singlePayDateRange: null,
        voucher: null,
        singlePayTotalNum: null
      },
      // 复合缴费表单提交项目
      mixFormPost: {
        houseId: null,
        houseName: null,
        mixPayType: [{
          name: '支付宝', value: null
        },
        { name: '微信', value: null
        },
        { name: '现金', value: null
        },
        { name: '其他', value: null
        }],
        mixPayTotalNum: null,
        remark: null,
        payItem: '商铺物业费',
        adminId: this.$store.getters.adminId,
        mixPayDateRange: null
      },
      // 单一收缴表单提交项目规则
      singleformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        singlePayType: [{ required: true, message: '请选择缴费方式', trigger: 'change' }],
        singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }],
        singlePayDateRange: [{ required: true, message: '请选择缴费周期', trigger: 'blur' }]
      },
      // 复合收缴表单提交项目规则
      mixformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        mixPayDateRange: [{ required: true, message: '请选择缴费周期', trigger: 'blur' }]
        // singlePayType: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
        // singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      dialogHouseLog: false,
      // 监听周期计算应交金额
      singlePropertyShallPay: 0,
      mixPropertyShallPay: 0,
      getProperty: {
        houseId: null,
        propertyDateRange: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ]),
    mixPayTotal: function() {
      var sum = 0
      this.mixFormPost.mixPayType.forEach((v, i) => {
        if (v.value === '') {
          v.value = 0
        }
        parseInt(v.value)
        sum += v.value
      })
      parseInt(sum)
      return sum
    },
    singlePayTotal: function() {
      var sum = 0
      var a = this.singleFormPost.singlePayMoney
      var b = this.singleFormPost.voucher
      // parseInt(Number(a))
      // parseInt(Number(b))
      if (a === '') {
        a = 0
      }
      if (b === '') {
        b = 0
      }
      sum = (a - 0) + (b - 0)
      return sum
    },
    payPatternChange() {
      return this.payPattern
    }
  },
  watch: {
    payPatternChange(val) {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$refs['singleDataForm'].clearValidate()
        this.singlePropertyShallPay = 0
        this.mixPropertyShallPay = 0
      }
      if (this.$refs['mixDataForm'] !== undefined) {
        this.$refs['mixDataForm'].clearValidate()
        this.singlePropertyShallPay = 0
        this.mixPropertyShallPay = 0
      }
    },
    // 监听前端周期变化
    // 单一缴费
    'singleFormPost.singlePayDateRange': function() {
      if (this.singleFormPost.singlePayDateRange !== null) {
        this.getSinglePayRealtimeProperty()
      }
      this.singlePropertyShallPay = 0
    },
    // 复合缴费
    'mixFormPost.mixPayDateRange': function() {
      if (this.mixFormPost.mixPayDateRange !== null) {
        this.getMixPayRealtimeProperty()
      }
      this.mixPropertyShallPay = 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchShopListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 绑定分页按钮
    fetchListSearch() {
      this.listLoading = true
      fetchShopSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 绑定搜索按钮
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      fetchShopSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 根据前端周期监听返回相应的金额
    // 单一缴费
    getSinglePayRealtimeProperty() {
      this.getProperty.houseId = this.singleFormPost.houseId
      this.getProperty.propertyDateRange = this.singleFormPost.singlePayDateRange
      getRealtimeProperty(this.getProperty).then(response => {
        this.singlePropertyShallPay = response.propertyShallPay
        this.mixPropertyShallPay = response.propertyShallPay
      })
    },
    // 复合缴费
    getMixPayRealtimeProperty() {
      this.getProperty.houseId = this.mixFormPost.houseId
      this.getProperty.propertyDateRange = this.mixFormPost.mixPayDateRange
      getRealtimeProperty(this.getProperty).then(response => {
        this.mixPropertyShallPay = response.propertyShallPay
      })
    },
    // 返回表尾部数据合计行
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        var str = ['houseShallPayProperty1', 'houseCashGet', 'basementShallPayProperty2', 'basementCashGet', 'gap']
        if (str.indexOf(column.property) > -1) {
          console.log('column--------')
          console.log(column)
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
    // 搜索框下面的收费按钮
    handleMoneyGetOutter() {
      this.singleFormPost.houseId = ''
      this.dialogMoneyPost = true
    },
    // 点击收费按钮
    handleMoneyGet(houseId, houseName) {
      this.singleFormPost.houseId = houseId
      this.mixFormPost.houseId = houseId
      this.singleFormPost.houseName = houseName
      this.mixFormPost.houseName = houseName
      fetchPreViewAll(houseId).then(response => {
        this.tableDataPvAll = response.data.pvData
      })
      this.dialogMoneyPost = true
    },
    // 获取验证码按钮
    getSmsCode(singleSMSPost) {
      singleSMSPost.houseId = this.singleFormPost.houseId
      getPropertySMS(singleSMSPost).then(response => {
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
    handleSMSPost(singleFormPost) {
      if (singleFormPost.smsCode === null || singleFormPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        singleMoneyPost(singleFormPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })

            this.dialogSMSVisible = false
            this.dialogMoneyPost = false
            this.$nextTick(() => {
              this.$refs['singleDataForm'].resetFields()
              this.singleFormPost.smsCode = ''
            })
            // 同时清空复合缴费表单
            this.mixFormPost.mixPayTotalNum = 0
            this.mixFormPost.mixPayType[0].value = ''
            this.mixFormPost.mixPayType[1].value = ''
            this.mixFormPost.mixPayType[2].value = ''
            this.mixFormPost.mixPayType[3].value = ''
            this.mixFormPost.remark = ''
            fetchSearchByHouseId(singleFormPost.houseId).then(response => {
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
    singleSubmitFormPost(singleFormPost) {
      this.singleFormPost.singlePayTotalNum = this.singlePayTotal
      // 表单项规则验证
      this.$refs['singleDataForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.singleFormPost.singlePayType === '特批') {
            this.dialogSMSVisible = true
          } else {
            // 操作确认框
            this.$confirm('确定提交么？', '费用收缴', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              this.singleFormPost.singlePayTotalNum = this.singlePayTotal
              singleMoneyPost(singleFormPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.$nextTick(() => {
                    this.$refs['singleDataForm'].resetFields()
                    this.singleFormPost.smsCode = ''
                  })
                  // 同时清空复合缴费表单
                  this.mixFormPost.mixPayTotalNum = 0
                  this.mixFormPost.mixPayType[0].value = ''
                  this.mixFormPost.mixPayType[1].value = ''
                  this.mixFormPost.mixPayType[2].value = ''
                  this.mixFormPost.mixPayType[3].value = ''
                  this.mixFormPost.remark = ''
                  this.dialogMoneyPost = false
                  fetchSearchByHouseId(singleFormPost.houseId).then(response => {
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
    // 复合收费提交收费表单
    mixSubmitFormPost(mixFormPost) {
      // 表单项规则验证
      this.$refs['mixDataForm'].validate((valid) => {
        console.log(this.mixPayTotal)
        if (this.mixPayTotal === 0) {
          this.$message.error('总金额为0！')
        }
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.mixFormPost.mixPayTotalNum = this.mixPayTotal
            mixMoneyPost(mixFormPost).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                // 同时清空单一缴费表单
                if (this.$refs['singleDataForm'] !== undefined) {
                  this.$nextTick(() => {
                    this.$refs['singleDataForm'].resetFields()
                  })
                }
                this.mixFormPost.mixPayTotalNum = 0
                this.mixFormPost.mixPayType[0].value = ''
                this.mixFormPost.mixPayType[1].value = ''
                this.mixFormPost.mixPayType[2].value = ''
                this.mixFormPost.mixPayType[3].value = ''
                this.mixFormPost.mixPayDateRange = null
                this.mixFormPost.remark = ''
                this.dialogMoneyPost = false
                fetchSearchByHouseId(mixFormPost.houseId).then(response => {
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
      this.singleFormPost.smsCode = ''
      this.dialogSMSVisible = false
    },
    // 收费页面取消按钮
    CleanDataForm() {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['singleDataForm'].resetFields()
        })
      }
      this.mixFormPost.mixPayTotalNum = 0
      this.mixFormPost.mixPayType[0].value = null
      this.mixFormPost.mixPayType[1].value = null
      this.mixFormPost.mixPayType[2].value = null
      this.mixFormPost.mixPayType[3].value = null
      this.mixFormPost.remark = ''
      this.mixFormPost.mixPayDateRange = ''
      this.singleFormPost.mixPayDateRange = ''
      this.dialogMoneyPost = false
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogHouseLog = true
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
