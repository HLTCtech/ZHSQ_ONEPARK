<template>
  <!-- 住宅电费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery_search.houseNum"
        type="text"
        placeholder="输入房间号"
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
      <!-- 时间选择器 -->
      <!-- <el-date-picker
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
      /> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter()"
      >
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      height="670"
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{
            scope.row.houseId
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="房间状态"
        prop="houseStatus"
        align="center"
        fixed
      />
      <el-table-column label="房间类型" prop="houseType" align="center" fixed />
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column
        label="业主手机号"
        prop="housePhone"
        align="center"
        fixed
      />
      <el-table-column label="电表号" prop="electricMeterId" align="center" />
      <el-table-column label="总购电金额" prop="amountMoney" align="center" />
      <el-table-column
        label="当前余额"
        prop="currentMoney"
        align="center"
        width="600"
      />
      <el-table-column label="备注" prop="remark" align="center" />
      <!-- <el-table-column label="费用收缴" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleMoneyGet(row.houseId, row.houseName, row.electricMeterId, row.currentMoney)">
            收缴
          </el-button>
        </template>
      </el-table-column> -->
      <el-table-column
        label="开户"
        align="center"
        width="80"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button
            :disabled="!showOpenBtn"
            type="primary"
            size="mini"
            @click="accountOpen(row)"
          >
            开户
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 费用收缴模态框 -->
    <el-dialog :visible.sync="dialogMoneyGetFormVisible" title="费用收缴">
      <!-- 展示当前房间的费用状态统计 -->
      <el-table
        :data="pvData_all"
        border
        fit
        highlight-current-row
        style="width: 100%"
        align="center"
      >
        <el-table-column prop="houseId" label="房间号" align="center" />
        <el-table-column prop="electricMeterId" label="电表号" align="center" />
        <el-table-column prop="currentMoney" label="当前余额" align="center" />
      </el-table>
      <br />

      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-switch
          v-model="payPattern"
          label=""
          label-width="100px"
          active-text="复合缴费"
          inactive-text="单一缴费"
          active-value="0"
          inactive-value="1"
        />
        <br />
        <br />

        <!-- 选择单一缴费时的提交表单 -->
        <div v-if="payPattern == 1" label="单一缴费" label-width="100px">
          <el-form
            ref="singleDataForm"
            :rules="singleformRules"
            :model="singleFormPost"
            label-width="80px"
          >
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input
                v-model="singleFormPost.houseId"
                placeholder="请输入单一完整房号（不要输入多个房号）"
              />
            </el-form-item>
            <el-form-item label="业主姓名" label-width="100px" prop="houseName">
              <el-input
                v-model="singleFormPost.houseName"
                placeholder="请输入业主姓名"
              />
            </el-form-item>
            <el-form-item
              label="缴费方式"
              label-width="100px"
              prop="singlePayType"
            >
              <el-select
                v-model="singleFormPost.singlePayType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in singlePayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="缴费金额"
              label-width="100px"
              prop="singlePayMoney"
            >
              <el-input
                v-model.number="singleFormPost.singlePayMoney"
                type="number"
                style="width: 200px"
                placeholder="请输入金额"
              />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input
                v-model="singleFormPost.remark"
                type="textarea"
                placeholder="如有需要请输入不多于30字的备注"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="success"
                @click="singleSubmitFormPost(singleFormPost)"
                >提交</el-button
              >
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 选择复合缴费时的提交表单 -->
        <div v-if="payPattern == 0" label="复合缴费" label-width="100px">
          <el-form
            ref="mixDataForm"
            :rules="mixformRules"
            :model="mixFormPost"
            label-width="80px"
          >
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input
                v-model="mixFormPost.houseId"
                placeholder="请输入单一完整房号（不要输入多个房号）"
              />
            </el-form-item>
            <el-form-item label="业主姓名" label-width="100px" prop="houseName">
              <el-input
                v-model="mixFormPost.houseName"
                placeholder="请输入业主姓名"
              />
            </el-form-item>
            <el-form-item label="支付宝" label-width="100px">
              <el-input
                v-model.number="mixFormPost.mixPayType[0].value"
                type="number"
                style="width: 200px"
                placeholder="请输入金额"
              /><br />
            </el-form-item>
            <el-form-item label="微信" label-width="100px">
              <el-input
                v-model.number="mixFormPost.mixPayType[1].value"
                type="number"
                style="width: 200px"
                placeholder="请输入金额"
              /><br />
            </el-form-item>
            <el-form-item label="现金" label-width="100px">
              <el-input
                v-model.number="mixFormPost.mixPayType[2].value"
                type="number"
                style="width: 200px"
                placeholder="请输入金额"
              /><br />
            </el-form-item>
            <el-form-item label="其他" label-width="100px">
              <el-input
                v-model.number="mixFormPost.mixPayType[3].value"
                type="number"
                style="width: 200px"
                placeholder="请输入金额"
              />
            </el-form-item>
            <el-form-item label="总金额" label-width="100px">
              <el-input v-model.number="mixPayTotal" width="100px" disabled />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input
                v-model="mixFormPost.remark"
                type="textarea"
                placeholder="如有需要请输入不多于30字的备注"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="mixSubmitFormPost(mixFormPost)"
                >提交</el-button
              >
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 收费类型为特批时验证码模态框处理 -->
        <el-dialog
          width="40%"
          title="领导审批"
          style="top: 20%"
          :visible.sync="dialogSMSVisible"
          append-to-body
        >
          <el-input
            ref="smsCode"
            v-model="singleFormPost.smsCode"
            placeholder="请输入短信验证码"
            name="smsCode"
            type="number"
            tabindex="1"
            autocomplete="on"
          />
          <el-button
            class="show-sms"
            type="primary"
            :disabled="(disabled = !show)"
            style="width:175px;"
            @click="getSmsCode(singleSMSPost)"
          >
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count"> {{ count }} s</span>
          </el-button>
          <br />
          <br />
          <el-button type="success" @click="handleSMSPost(singleFormPost)"
            >确定提交</el-button
          >
          <el-button @click="handleCleanSMS()">取消</el-button>
        </el-dialog>
      </el-card>
    </el-dialog>

    <!-- 月度费用状态详情模态框 -->
    <el-dialog
      :visible.sync="dialogPvVisibleDetailByMonth"
      title="所有的费用详情"
    >
      <el-table
        :data="pvData_details"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="年/月" prop="date" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="读数" prop="meterReading" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.meterReading }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应收" prop="shallPay" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.shallPay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未收" prop="notPay" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.notPay }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisibleDetailByMonth = false"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- 点击houseId弹出信息变更历史模态框 -->
    <el-dialog :visible.sync="dialogHouseLog" title="房屋信息变更历史">
      <el-table
        :data="pvData_HouseLog"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="houseName" label="业主姓名" />
        <el-table-column prop="housePhone" label="业主手机号" />
        <el-table-column prop="houseArea" label="住宅面积" />
        <el-table-column prop="basementArea" label="地下室面积" />
        <el-table-column prop="changeTime" label="变更时间" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHouseLog = false"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- 所有费用状态的弹出模态框 -->
    <el-dialog :visible.sync="dialogPvVisible_all" title="所有的费用详情">
      <el-table
        :data="pvData_all"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="prestore" label="预存余额" />
        <el-table-column prop="shallPayAll" label="应收总计金额" />
        <el-table-column prop="receivedPayAll" label="实收总计金额" />
        <el-table-column prop="notPayAll" label="未缴总计金额" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible_all = false"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- 单一月份具体费用信息的弹出模态框 -->
    <el-dialog :visible.sync="dialogPvVisible_single" title="费用详情">
      <el-table
        :data="pvData_single"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="shallPay" label="应收金额" />
        <el-table-column prop="receivedPay" label="实收金额" />
        <el-table-column prop="notPay" label="未缴金额" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible_single = false"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- 开户模态框 -->
    <el-dialog :visible.sync="dialogAccountOpen" title="开户">
      <el-button type="success" @click="handleAccountOpen(accountOpenForm)"
        >确定开户</el-button
      >
      <el-button @click="handleCancleAccountOpen()">取消</el-button>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery_search.page"
      @pagination="fetchListSearch"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  fetchHouseSearch,
  fetchPreViewSingle,
  fetchPreViewAll,
  singleMoneyPost,
  mixMoneyPost,
  fetchSearchByHouseId,
  getElectricSMS,
  openAccount
} from '@/api/payElectric'
import { getLogByHouseId } from '@/api/operationLog'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricHousePay',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      showOpenBtn: false,
      dialogAccountOpen: false,
      // 开户提交
      accountOpenForm: {
        houseId: null,
        adminId: this.$store.getters.adminId
      },
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        buildingNum: null,
        unitNum: null,
        houseNum: null,
        datePicker: null,
        houseName: null,
        year: '2020'
      },
      // 单一缴费时的选项
      singlePayOptions: [
        { value: '支付宝', label: '支付宝' },
        { value: '微信', label: '微信' },
        { value: '现金', label: '现金' },
        { value: '其他', label: '其他' },
        { value: '特批', label: '特批' }
      ],
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        electricMeterId: null,
        adminId: this.$store.getters.adminId,
        payItem: '住宅电费'
      },
      // 单一缴费表单提交项目
      singleFormPost: {
        houseId: null,
        houseName: null,
        singlePayType: null,
        singlePayMoney: null,
        remark: null,
        payItem: '住宅电费',
        adminId: this.$store.getters.adminId,
        smsCode: null,
        singlePayDateRange: null,
        electricMeterId: null
      },
      // 复合缴费表单提交项目
      mixFormPost: {
        houseId: null,
        houseName: null,
        mixPayType: [
          {
            name: '支付宝',
            value: null
          },
          { name: '微信', value: null },
          { name: '现金', value: null },
          { name: '其他', value: null }
        ],
        mixPayTotalNum: null,
        remark: null,
        payItem: '住宅电费',
        mixPayDateRange: null,
        adminId: this.$store.getters.adminId,
        electricMeterId: null
      },
      // 单一收缴表单提交项目规则
      singleformRules: {
        houseId: [
          { required: true, message: '请输入单一的完整房间号', trigger: 'blur' }
        ],
        singlePayType: [
          { required: true, message: '请选择缴费方式', trigger: 'blur' }
        ],
        singlePayMoney: [
          {
            required: true,
            message: '请输入收缴金额（纯数字）',
            type: 'number',
            trigger: 'blur'
          }
        ],
        singlePayDateRange: [
          { required: true, message: '请选择缴费周期', trigger: 'blur' }
        ]
      },
      // 复合收缴表单提交项目规则
      mixformRules: {
        houseId: [
          { required: true, message: '请输入单一的完整房间号', trigger: 'blur' }
        ],
        mixPayDateRange: [
          { required: true, message: '请选择缴费周期', trigger: 'blur' }
        ]
        // singlePayType: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
        // singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      // 定义顶部搜索框的选择字段
      lou_numOptions: [
        '1号楼',
        '2号楼',
        '3号楼',
        '4号楼',
        '5号楼',
        '6号楼',
        '7号楼',
        '8号楼',
        '9号楼',
        '10号楼',
        '11号楼',
        '12号楼',
        '13号楼',
        '14号楼',
        '15号楼',
        '16号楼',
        '17号楼',
        '18号楼',
        '19号楼',
        '20号楼',
        '21号楼',
        '22号楼',
        '23号楼',
        '24号楼',
        '25号楼',
        '26号楼',
        '27号楼',
        '28号楼',
        '29号楼',
        '30号楼',
        '31号楼'
      ],
      danyuan_numOptions: ['1单元', '2单元', '3单元'],
      floor_numOptions: [
        '1楼',
        '2楼',
        '3楼',
        '4楼',
        '5楼',
        '6楼',
        '7楼',
        '8楼',
        '9楼',
        '10楼',
        '11楼',
        '12楼',
        '13楼',
        '14楼',
        '15楼',
        '16楼',
        '17楼',
        '18楼'
      ],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      // 声明下api变量
      titleData: [],
      tableColumns: [],
      pvData_HouseLog: [],
      // 定义模态框显示与否
      dialogMoneyGetFormVisible: false,
      dialogFormVisible: false,
      dialogPvVisibleDetailByMonth: false,
      dialogStatus: '',
      pvData_all: [],
      pvData_single: [],
      pvData_details: [],
      dialogPvVisible_all: false,
      dialogPvVisible_single: false,
      dialogApproveSmsVisible: false,
      dialogHouseLog: false,
      checkBoxData: [],
      tableData: [],
      // 时间选择器返回数据
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 往后推算的时间选择器
      nextPickerOptions: {
        shortcuts: [
          {
            text: '一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              end.setMonth(start.getMonth() + 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              end.setMonth(start.getMonth() + 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
              end.setMonth(start.getMonth() + 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // end.setTime(start.getTime() + 3600 * 1000 * 24 * 360)
              end.setMonth(start.getMonth() + 12)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
      //   date_picker: ''
    }
  },
  computed: {
    ...mapGetters(['adminName', 'adminId', 'roles']),
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
    payPatternChange() {
      return this.payPattern
    }
  },
  watch: {
    payPatternChange(val) {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$refs['singleDataForm'].clearValidate()
      }
      if (this.$refs['mixDataForm'] !== undefined) {
        this.$refs['mixDataForm'].clearValidate()
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 根据选定信息搜索
    fetchListSearch() {
      this.listLoading = true
      fetchHouseSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      fetchHouseSearch(this.listQuery_search).then(response => {
        response.msg === '不显示开户'
          ? (this.showOpenBtn = false)
          : (this.showOpenBtn = true)
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 收费按钮绑定的处理事件
    handleMoneyGet(houseId, houseName, electricMeterId, currentMoney) {
      this.singleFormPost.houseId = houseId
      this.mixFormPost.houseId = houseId
      this.singleFormPost.houseName = houseName
      this.mixFormPost.houseName = houseName
      this.singleFormPost.electricMeterId = electricMeterId
      this.mixFormPost.electricMeterId = electricMeterId
      fetchPreViewAll(houseId, electricMeterId, currentMoney).then(response => {
        this.pvData_all = response.data.pvData
      })
      this.dialogMoneyGetFormVisible = true
    },
    // 获取费用状态统计
    handleFetchPv_all(houseId, electricMeterId) {
      // 定义具体费用字段的弹出模态框
      fetchPreViewAll(houseId, electricMeterId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogPvVisible_all = true
      })
    },
    // 获取单月费用状态
    handleFetchPv_single(pv, houseId, electricMeterId) {
      // 定义具体费用字段的弹出模态框
      console.log(pv, houseId, electricMeterId)
      //   console.log('currentTarget-----' + pv.currentTarget)
      fetchPreViewSingle(pv, houseId, electricMeterId).then(response => {
        this.pvData_single = response.data.pvData
        this.dialogPvVisible_single = true
      })
    },
    // 获取验证码按钮
    getSmsCode(singleSMSPost) {
      singleSMSPost.houseId = this.singleFormPost.houseId
      singleSMSPost.electricMeterId = this.singleFormPost.electricMeterId
      getElectricSMS(singleSMSPost).then(response => {
        if (response.codeStatus === 200) {
          this.$message({
            message: '验证码会发送到您的手机上，请注意查收',
            type: 'success'
          })
        } else {
          this.$message({
            message: '提交失败，请联系系统管理员',
            type: 'error'
          })
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
      if (
        singleFormPost.smsCode === null ||
        singleFormPost.smsCode.length < 6
      ) {
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
            this.dialogMoneyGetFormVisible = false
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
            fetchSearchByHouseId(
              singleFormPost.houseId,
              singleFormPost.electricMeterId
            ).then(response => {
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
    // 单一收费提交收费表单
    singleSubmitFormPost(singleFormPost) {
      // 表单项规则验证
      this.$refs['singleDataForm'].validate(valid => {
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
                  this.dialogMoneyGetFormVisible = false
                  fetchSearchByHouseId(
                    singleFormPost.houseId,
                    singleFormPost.electricMeterId
                  ).then(response => {
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
    },
    // 复合收费提交收费表单
    mixSubmitFormPost(mixFormPost) {
      // 表单项规则验证
      this.$refs['mixDataForm'].validate(valid => {
        console.log(this.mixPayTotal)
        if (this.mixPayTotal === 0) {
          // this.$message.error('总金额为0！')
          this.$confirm('总金额为0', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
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
                    this.dialogMoneyGetFormVisible = false
                    fetchSearchByHouseId(
                      mixFormPost.houseId,
                      mixFormPost.electricMeterId
                    ).then(response => {
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
          })
        } else if (valid) {
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
                this.dialogMoneyGetFormVisible = false
                fetchSearchByHouseId(
                  mixFormPost.houseId,
                  mixFormPost.electricMeterId
                ).then(response => {
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
      this.mixFormPost.mixPayDateRange = null
      this.dialogMoneyGetFormVisible = false
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      // 定义具体费用字段的弹出模态框
      getLogByHouseId(houseId).then(response => {
        this.pvData_HouseLog = response.data.pvData
        this.dialogHouseLog = true
      })
    },
    // 开户
    accountOpen(row) {
      this.dialogAccountOpen = true
      this.accountOpenForm.houseId = row.houseId
    },
    // 取消开户模态框
    handleCancleAccountOpen() {
      this.dialogAccountOpen = false
    },
    // 开户按钮
    handleAccountOpen(accountOpenForm) {
      openAccount(accountOpenForm).then(response => {
        if (response.code === 200) {
          this.$notify({
            title: 'Success',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
          this.dialogAccountOpen = false
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
