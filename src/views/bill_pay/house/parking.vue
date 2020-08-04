<template>
  <!-- 住宅停车场维护费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery_search.houseId"
        type="text"
        placeholder="输入房号"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.houseName"
        type="text"
        placeholder="输入业主姓名"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.carNum"
        type="text"
        placeholder="输入车牌号"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.carLoc"
        type="text"
        placeholder="输入车位"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>

    <!-- 新增车位信息 -->
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleNewParking()"
    >新增车位信息</el-button>
    <br>
    <br>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      height="1000"
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="车位号" prop="carLoc" align="center" />
      <el-table-column label="销售状态" prop="isSold" align="center" />
      <el-table-column label="房号" prop="houseId" align="center">
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" prop="houseName" align="center" />
      <el-table-column label="联系电话" prop="housePhone" align="center" />
      <el-table-column label="车牌号" prop="carNum" align="center" />
      <el-table-column label="购买日期" prop="paidDate" align="center" />
      <el-table-column label="销售状态" prop="salingStatus" align="center" />
      <el-table-column label="车位属性" prop="parkingStatus" align="center" />
      <el-table-column label="应缴日期" prop="shallpayDate" align="center" />
      <el-table-column label="截止日期" prop="deadlineDate" align="center" />
      <el-table-column label="逾期天数" prop="overdueDays" align="center" />

      <el-table-column label="指定开始费用周期" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- 收费按钮相对应的模态框以及函数暂未开发 -->
          <el-button type="primary" size="mini" @click="handleRangeStart(row.carLoc)">
            指定日期
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleCarInfoChange(row)">变更/收费</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 指定停车场维护费周期开始日期 -->
    <el-dialog :visible.sync="dialogRangeStart" title="指定停车场维护费周期开始日期" width="40%">
      <el-form :model="dateRangeStartForm" label-width="80px">
        <el-form-item label="开始日期" label-width="100px" prop="dateRangeStart">
          <el-date-picker
            v-model="dateRangeStartForm.dateRangeStart"
            class="filter-item"
            type="date"
            align="right"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left:50px" @click="daterangeStartPost(dateRangeStartForm)">提交</el-button>
      <el-button @click="handleCleandaterangeStartPost()">取消</el-button>
    </el-dialog>

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

    <!-- 信息变更按钮：定义表单提交项 -->
    <el-dialog :visible.sync="dialogParkingInfoChangeFormVisible" title="信息变更/续费">
      <!-- 展示当前房间的费用状态统计 -->
      <el-table :data="tableDataPvAll" border fit highlight-current-row style="width: 100%" align="center">
        <el-table-column prop="houseId" label="房间号" align="center" />
        <el-table-column prop="carLoc" label="车位号" align="center" />
        <el-table-column prop="carShallPayDate" label="应缴费日期" align="center" />
        <el-table-column prop="carDeadline" label="截止日期" align="center" />
        <el-table-column prop="carOverdueDays" label="逾期天数" align="center" />
        <el-table-column prop="carMonths" label="月数" align="center" />
        <el-table-column prop="carShallPayParking" label="应交费用" align="center" />
      </el-table>
      <br>

      <el-card class="box-card">
        <el-form ref="infoChangeData" :model="infoChangeFormPost" label-width="80px">
          <el-form-item label="房号" label-width="100px" prop="houseId">
            <el-input v-model="infoChangeFormPost.houseId" />
          </el-form-item>
          <el-form-item label="业主姓名" label-width="100px" prop="houseName">
            <el-input v-model="infoChangeFormPost.houseName" />
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px" prop="houseName">
            <el-input v-model="infoChangeFormPost.housePhone" />
          </el-form-item>
          <el-form-item label="车牌号" label-width="100px" prop="carNum">
            <el-input v-model="infoChangeFormPost.carNum" />
          </el-form-item>
          <el-form-item label="指定位置" label-width="100px" prop="carLoc">
            <el-input v-model="infoChangeFormPost.carLoc" disabled />
          </el-form-item>
          <el-form-item label="缴费周期" label-width="100px">
            <el-form-item prop="dateRange">
              <el-date-picker
                v-model="infoChangeFormPost.dateRange"
                class="filter-item"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="nextPickerOptions"
                validate-event
                required
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="缴款方式" label-width="100px" prop="payType">
            <el-radio-group v-model="infoChangeFormPost.payType">
              <el-radio label="支付宝" />
              <el-radio label="微信" />
              <el-radio label="现金" />
              <el-radio label="其他" />
              <el-radio label="特批" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="缴费金额" label-width="100px" prop="moneyNum" autocomplete="off">
            <el-input v-model.number="infoChangeFormPost.moneyNum" width="100px" />
          </el-form-item>
          <el-form-item label="代金券金额" label-width="100px" prop="voucher">
            <el-input v-model="infoChangeFormPost.voucher" placeholder="请输入代金券金额" />
          </el-form-item>
          <el-form-item label="实收总金额" label-width="100px">
            <el-input v-model.number="changePayTotal" width="100px" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="infoChangeFormPost.remark"
              type="textarea"
              placeholder="如有需要请输入不多于30字的备注"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitInfoChangeForm(infoChangeFormPost)">提交</el-button>
            <el-button @click="handleCleanInfoChangeDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 变更信息---收费类型为特批时验证码模态框处理 -->
    <el-dialog
      width="40%"
      title="领导审批"
      style="top: 20%"
      :visible.sync="changeInfoDialogApproveSmsVisible"
      append-to-body
    >
      <el-input
        ref="changeInfoSmsCode"
        v-model="infoChangeFormPost.smsCode"
        placeholder="请输入短信验证码"
        name="changeInfoSmsCode"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
      <el-button
        class="show-sms"
        type="primary"
        :disabled="disabled=!show"
        style="width:175px;"
        @click="handleGetSmsCode(SMSPost)"
      >
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count">{{ count }} s</span>
      </el-button>
      <br>
      <br>
      <el-button type="success" @click="handleChangeInfoPost(infoChangeFormPost)">确定提交</el-button>
      <el-button @click="handleChangeInfoCleanSMSDataForm()">取消</el-button>
    </el-dialog>

    <!-- 新增信息按钮的模态框(包含收费功能) -->
    <el-dialog :visible.sync="dialogNewCarInfoVisible" title="新增车辆信息">
      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form
          ref="newInfoForm"
          :rules="newCarInfoFormRules"
          :model="newInfoFormPost"
          label-width="80px"
        >
          <el-form-item label="房号" label-width="100px" prop="houseId" required>
            <el-input v-model="newInfoFormPost.houseId" placeholder="请输入房号（只允许输入一个）" />
          </el-form-item>
          <el-form-item label="业主姓名" label-width="100px" prop="houseName" required>
            <el-input v-model="newInfoFormPost.houseName" />
          </el-form-item>
          <el-form-item label="业主电话" label-width="100px" prop="housePhone" required>
            <el-input v-model="newInfoFormPost.housePhone" />
          </el-form-item>
          <el-form-item label="车牌号" label-width="100px" prop="carNum" required>
            <el-input v-model="newInfoFormPost.carNum" />
          </el-form-item>
          <el-form-item label="车辆品牌" label-width="100px" prop="carBrand" required>
            <el-input v-model="newInfoFormPost.carBrand" />
          </el-form-item>
          <el-form-item label="颜色" label-width="100px" prop="carColor" required>
            <el-input v-model="newInfoFormPost.carColor" />
          </el-form-item>
          <el-form-item label="指定位置" label-width="100px" prop="carLoc" required>
            <el-input v-model="newInfoFormPost.carLoc" />
          </el-form-item>
          <el-form-item label="有效期" label-width="100px" required>
            <el-form-item prop="dateRange">
              <el-date-picker
                v-model="newInfoFormPost.dateRange"
                class="filter-item"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                validate-event
                required
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="缴款方式" label-width="100px" prop="payType" required>
            <el-radio-group v-model="newInfoFormPost.payType">
              <el-radio label="支付宝" />
              <el-radio label="微信" />
              <el-radio label="现金" />
              <el-radio label="其他" />
              <el-radio label="特批" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="缴费金额" label-width="100px" prop="moneyNum" autocomplete="off">
            <el-input v-model.number="newInfoFormPost.moneyNum" width="100px" />
          </el-form-item>
          <el-form-item label="代金券金额" label-width="100px" prop="voucher">
            <el-input v-model="newInfoFormPost.voucher" placeholder="请输入代金券金额" />
          </el-form-item>
          <el-form-item label="实收总金额" label-width="100px">
            <el-input v-model.number="singlePayTotal" width="100px" disabled />
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input
              v-model="newInfoFormPost.remark"
              type="textarea"
              placeholder="如有需要请输入不多于30字的备注"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitNewInfoForm(newInfoFormPost)">确认提交</el-button>
            <el-button @click="handleCleanNewInfoDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 新增信息---收费类型为特批时验证码模态框处理 -->
    <el-dialog
      width="40%"
      title="领导审批"
      style="top: 20%"
      :visible.sync="newInfoDialogApproveSmsVisible"
      append-to-body
    >
      <el-input
        ref="newInfoSmsCode"
        v-model="newInfoFormPost.smsCode"
        placeholder="请输入短信验证码"
        name="newInfoSmsCode"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
      <el-button
        class="show-sms"
        type="primary"
        :disabled="disabled=!show"
        style="width:175px;"
        @click="handleGetSmsCode(SMSPost)"
      >
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count">{{ count }} s</span>
      </el-button>
      <br>
      <br>
      <el-button type="success" @click="handleNewInfoPost(newInfoFormPost)">确定提交</el-button>
      <el-button @click="handleNewInfoCleanSMSDataForm()">取消</el-button>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery_search.page"
      @pagination="fetchListSearch()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchListAll, fetchSearch, fetchSearchByCarLoc, postNewCarInfo, postChangeInfo, getSMSCode, fetchParkingPreViewAll, postDaterangeStart } from '@/api/payParking'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PayParking',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      tableDataPvAll: [],
      total: 0,
      pvData_all: [],
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        houseName: null,
        carNum: null,
        carLoc: null
      },
      // 定义验证码界面计时器
      show: true,
      count: '',
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      // 定义提交新增车位信息字段
      newInfoFormPost: {
        houseId: null,
        houseName: null,
        housePhone: null,
        carNum: null,
        carBrand: null,
        carColor: null,
        carLoc: null,
        dateRange: null,
        remark: null,
        payType: null,
        moneyNum: null,
        voucher: null,
        adminId: this.$store.getters.adminId,
        moneyPayTotal: null
      },
      // 定义车位信息变更时的字段
      infoChangeFormPost: {
        houseId: null,
        houseName: null,
        housePhone: null,
        carNum: null,
        carBrand: null,
        carColor: null,
        carLoc: null,
        dateRange: null,
        remark: null,
        payType: null,
        moneyNum: null,
        voucher: null,
        adminId: this.$store.getters.adminId,
        moneyPayTotal: null
      },
      // 定义新增车位信息表单提交项目规则
      newCarInfoFormRules: {
        houseId: [{ required: true, message: '请输入房号' }],
        houseName: [{ required: true, message: '请输入业主姓名' }],
        housePhone: [{ required: true, message: '请输入业主电话' }],
        carNum: [{ required: true, message: '请输入车牌号' }],
        carBrand: [{ required: true, message: '请输入车辆品牌' }],
        carColor: [{ required: true, message: '请输入车辆颜色' }],
        carLoc: [{ required: true, message: '请输入指定位置' }],
        dateRange: [{ required: true, message: '请选择时间周期' }],
        moneyNum: [{ required: true, message: '请输入缴费金额' }],
        payType: [{ required: true, message: '请选择缴费方式' }]
      },
      // 声明下api变量
      tableData: [],
      dialogParkingMoneyGetFormVisible: false,
      dialogNewCarInfoVisible: false,
      dialogParkingInfoChangeFormVisible: false,
      newInfoDialogApproveSmsVisible: false,
      changeInfoDialogApproveSmsVisible: false,
      dialogHouseLog: false,
      // 调取短信验证码提交项目
      SMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '停车场管理费'
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
      // 往后推算的时间选择器
      nextPickerOptions: {
        shortcuts: [{
          text: '一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            // end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            end.setMonth(start.getMonth() + 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            // end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            end.setMonth(start.getMonth() + 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            // end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
            end.setMonth(start.getMonth() + 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            // end.setTime(start.getTime() + 3600 * 1000 * 24 * 360)
            end.setMonth(start.getMonth() + 12)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 费用周期指定表单
      dateRangeStartForm: {
        carLoc: '',
        dateRangeStart: '',
        adminId: this.$store.getters.adminId
      },
      dialogRangeStart: false
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ]),
    singlePayTotal: function() {
      var sum = 0
      var a = this.newInfoFormPost.moneyNum
      var b = this.newInfoFormPost.voucher
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
    changePayTotal: function() {
      var sum = 0
      var a = this.infoChangeFormPost.moneyNum
      var b = this.infoChangeFormPost.voucher
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      this.listLoading = true
      fetchSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 搜索按钮
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      fetchSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 指定费用周期开始
    handleRangeStart(carLoc) {
      this.dateRangeStartForm.carLoc = carLoc
      this.dialogRangeStart = true
    },
    // 提交费用周期开始
    daterangeStartPost(dateRangeStartForm) {
      console.log(this.dateRangeStartForm)
      if (dateRangeStartForm.dateRangeStart === '') {
        this.$notify({
          title: 'error',
          message: '请选择日期',
          type: 'error',
          duration: 2000
        })
      } else {
        postDaterangeStart(dateRangeStartForm).then(response => {
          if (response.codeStatus === 200) {
            this.dialogRangeStart = false
            this.dateRangeStartForm.dateRangeStart = null
            this.$message({ message: '提交成功', type: 'success' })
          } else {
            this.$message({ message: '提交失败，请联系系统管理员', type: 'error' })
          }
        })
      }
    },
    // 费用收缴按钮绑定的处理事件
    handleCarInfoChange(row) {
      this.infoChangeFormPost.houseId = row.houseId
      this.infoChangeFormPost.houseName = row.houseName
      this.infoChangeFormPost.housePhone = row.housePhone
      this.infoChangeFormPost.carNum = row.carNum
      this.infoChangeFormPost.carLoc = row.carLoc
      fetchParkingPreViewAll(row.houseId).then(response => {
        this.tableDataPvAll = response.data.pvData
      })
      this.dialogParkingInfoChangeFormVisible = true
    },
    // 新增信息---获取验证码按钮
    handleGetSmsCode(SMSPost) {
      this.SMSPost.houseId = this.newInfoFormPost.houseId
      getSMSCode(SMSPost).then(response => {
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
    // 信息变更---提交收费表单
    handleSubmitInfoChangeForm(infoChangeFormPost) {
      this.infoChangeFormPost.moneyPayTotal = this.changePayTotal
      // 收费类型为特批时验证码模态框处理
      if (this.infoChangeFormPost.payType === '特批') {
        this.changeInfoDialogApproveSmsVisible = true
      } else {
        // 操作确认框
        this.$confirm('确定提交么？', '费用收缴', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          postChangeInfo(infoChangeFormPost).then(response => {
            if (response.codeStatus === 200) {
              this.$notify({
                title: 'Success',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              this.dialogParkingInfoChangeFormVisible = false
              this.$nextTick(() => {
                this.$refs['infoChangeData'].resetFields()
              })
              fetchSearchByCarLoc(infoChangeFormPost.carLoc).then(response => {
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
    },
    // 信息变更---缴款类型是特批时，验证码点击提交的收费表单
    handleChangeInfoPost(infoChangeFormPost) {
      if (infoChangeFormPost.smsCode === null || infoChangeFormPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        postChangeInfo(infoChangeFormPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogParkingInfoChangeFormVisible = false
            this.changeInfoDialogApproveSmsVisible = false
            this.$nextTick(() => {
              this.$refs['infoChangeData'].resetFields()
            })
            this.infoChangeFormPost.smsCode = ''
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchSearchByCarLoc(infoChangeFormPost.carLoc).then(response => {
              this.tableData = response.data.items
              this.total = response.total
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
    // 新增信息---提交新增车辆信息表单
    handleSubmitNewInfoForm(newInfoFormPost) {
      this.newInfoFormPost.moneyPayTotal = this.singlePayTotal
      this.$refs['newInfoForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.newInfoFormPost.payType === '特批') {
            this.newInfoDialogApproveSmsVisible = true
          } else {
            this.$confirm('确定提交么？', '新增信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              postNewCarInfo(newInfoFormPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.dialogNewCarInfoVisible = false
                  this.$nextTick(() => {
                    this.$refs['newInfoForm'].resetFields()
                  })
                  fetchSearchByCarLoc(newInfoFormPost.carLoc).then(response => {
                    this.tableData = response.data.items
                    this.total = response.total
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
    // 新增车位---缴款类型是特批时，验证码点击提交的收费表单
    handleNewInfoPost(newInfoFormPost) {
      if (newInfoFormPost.smsCode === null || newInfoFormPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        postNewCarInfo(newInfoFormPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogNewCarInfoVisible = false
            this.newInfoDialogApproveSmsVisible = false
            this.$nextTick(() => {
              this.$refs['newInfoForm'].resetFields()
            })
            this.newInfoFormPost.smsCode = ''
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchSearchByCarLoc(newInfoFormPost.carLoc).then(response => {
              this.tableData = response.data.items
              this.total = response.total
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
    handleNewParking() {
      this.dialogNewCarInfoVisible = true
    },
    handleCleanNewInfoDataForm() {
      this.$nextTick(() => {
        this.$refs['newInfoForm'].resetFields()
      })
      this.dialogNewCarInfoVisible = false
    },
    handleCleanInfoChangeDataForm() {
      this.$nextTick(() => {
        this.$refs['infoChangeData'].resetFields()
      })
      this.dialogParkingInfoChangeFormVisible = false
    },
    handleNewInfoCleanSMSDataForm() {
      this.newInfoFormPost.smsCode = ''
      this.newInfoDialogApproveSmsVisible = false
    },
    handleChangeInfoCleanSMSDataForm() {
      this.infoChangeFormPost.smsCode = ''
      this.changeInfoDialogApproveSmsVisible = false
    },
    // 取消指定费用周期
    handleCleandaterangeStartPost() {
      this.dialogRangeStart = false
      this.dateRangeStartForm.dateRangeStart = null
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

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
